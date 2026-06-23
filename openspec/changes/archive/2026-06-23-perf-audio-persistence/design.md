# Design: Audio & Persistence Performance

## Technical Approach

Four independent refactors targeting serialization churn, full HTML recomputation, IndexedDB connection churn, and over-broad watchers. Each change is measurable in isolation and independently revertible.

## Architecture Decisions

### Decision 1: localStorage In-Memory Cache

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Proxy-based auto-sync | Transparent but adds complexity to simple file | ❌ |
| Dirty-flag + batch flush | Optimal for bulk writes, overkill for single-op UI | ❌ |
| **Flat module-level cache** | Direct mutations, serialize only on `saveAll()` | ✅ |

**Rationale**: Every mutation already has a synchronous write point (`saveAll`). Cache the parsed array once in `loadAll()`; all subsequent reads hit the cache. `saveAll()` serializes from cache. Invalidation via `storage` event listener for cross-tab safety (per proposal risk).

### Decision 2: IndexedDB Singleton Connection

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Singleton class | Cleaner OOP, but no callers need it | ❌ |
| **Module-level cached promise** | `openDB()` returns `Promise<IDBDatabase>`, cached on first call | ✅ |

**Rationale**: Promises are idempotent — `openDB()` on first call creates the connection; all subsequent calls resolve instantly with the cached promise. Add `window.addEventListener('beforeunload', () => db.close())` to prevent leak.

### Decision 3: Rendered HTML Caching

| Option | Tradeoff | Decision |
|--------|----------|----------|
| Manual cache with string key | Explicit but fragile | ❌ |
| **Split into two computeds** | `cachedHtml` (content + transpose) + `renderedHtml` (filter by visibility) | ✅ |

**Rationale**: `cachedHtml` reacts only to `song.value.content` and `currentStep` — section visibility toggles skip chord detection entirely. `renderedHtml` reads cached lines and builds the filtered DOM string. Approx 90% reduction in work on section toggle.

### Decision 4: Narrow Song Watcher for Audio

| Option | Tradeoff | Decision |
|--------|----------|----------|
| `{ deep: false }` + manual guard | Still fires on any song ref change | ❌ |
| **Watch `() => song.value?.audioKey`** | Only fires when the audio key field changes | ✅ |

**Rationale**: `audioKey` is the only field that determines whether audio exists. Transpose, loops, markers, visibility — none should reload audio. The watcher returns early if value is falsy, matching existing behavior.

## Data Flow

```
Before:                        After:
localStorageAdapter            localStorageAdapter
  loadAll()  ──JSON.parse──►     loadAll() ──JSON.parse──► cache (once)
  update()                       update()
    ├─ JSON.parse (repeat)          ├─ cache[index] = song
    ├─ mutate                       └─ saveAll() ──JSON.stringify──► storage
    └─ JSON.stringify

useAudioCache                  useAudioCache
  saveAudio()                    openDB()  ──► promise (cached)
    └─ openDB()                   saveAudio()
  loadAudio()                      └─ await openDB() ──► same connection
    └─ openDB() (repeat)
                               onbeforeunload ──► db.close()

SongDetail                     SongDetail
  renderedHtml                   cachedHtml (content + transpose)
    └─ chord regex × N lines       └─ chord regex × N lines (only on change)
    └─ section filter            renderedHtml
                                   └─ slice cachedLines by visibility
  watch(song) ──► loadAudio     watch(audioKey) ──► loadAudio (only on key change)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/stores/adapters/localStorageAdapter.js` | Modify | Add `_cache` variable; `loadAll()` caches + returns; `saveAll()` writes from cache; add `storage` listener to invalidate |
| `src/stores/playlistsStore.js` | Modify | In `create`/`update`/`remove`, mutate in-memory `playlists` ref directly instead of re-reading from localStorage; flush to localStorage once |
| `src/composables/useAudioCache.js` | Modify | Hoist `openDB()` call to module level; cache promise; export a `closeDB()` for cleanup |
| `src/views/SongDetail.vue` | Modify | Split `renderedHtml` into `cachedHtml` + filtered; change `watch(song, loadSongAudio)` to `watch(() => song.value?.audioKey, ...)` |

## Interfaces / Contracts

No new public interfaces. Internal changes:

```js
// useAudioCache.js — new export
export function closeDB() { /* close cached connection */ }
export function useAudioCache() { /* same return shape */ }

// localStorageAdapter.js — internal only
let _cache = null
let _cachedRaw = null  // for change detection before flush
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | Cache invalidation | localStorage stub; verify `setItem` count drops by 75% in create/update/delete |
| Unit | IndexedDB singleton | Spy on `indexedDB.open` calls; verify only 1 per module lifetime |
| Manual | Song watcher | Toggle transpose; confirm `loadAudio` is not called (log) |

No test runner is configured (config.yaml: `runner: none`). Testing sections serve as verification checklist for manual review.

## Migration / Rollout

No migration required. Cache is cold on first load (fills on first `loadAll()` call). IndexedDB singleton connects on first use. All changes are invisible to the user.

## Open Questions

None.
