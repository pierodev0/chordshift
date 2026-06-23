# Tasks: Audio & Persistence Performance

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~70–95 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Delivery strategy | single-pr |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | PR | Notes |
|------|------|----|-------|
| 1 | All 4 refactors (single PR) | PR 1 | Independent files, single commit per concern |

## Phase 1: Data Persistence Layer

- [x] 1.1 `localStorageAdapter.js` — Add `_cache` and `_cachedRaw` variables; `loadAll()` reads once, returns cached array; `saveAll()` serializes from cache; add `storage` event listener to invalidate on external changes
- [x] 1.2 `playlistsStore.js` — In `create`/`update`/`remove`, mutate `playlists.value` directly instead of re-reading from localStorage; flush to localStorage once per operation

## Phase 2: Audio Layer

- [x] 2.1 `useAudioCache.js` — Hoist `openDB()` to module level; cache the promise so all subsequent calls resolve instantly with the same connection
- [x] 2.2 — All internal functions (`saveAudio`, `loadAudio`, `loadAudioBlob`, `loadAudioBuffer`, `deleteAudio`) use `await openDB()` returning the cached connection; export `closeDB()` for cleanup; add `beforeunload` listener to close DB

## Phase 3: UI Layer

- [x] 3.1 `SongDetail.vue` — Split `renderedHtml` into `cachedHtml` (depends on `song.value.content` + `currentStep`) and filtered `renderedHtml` (slices `cachedHtml` by visibility). Section toggles skip chord regex entirely
- [x] 3.2 `SongDetail.vue` — Change `watch(song, loadSongAudio)` to `watch(() => song.value?.audioKey, loadSongAudio)` so audio only re-fetches when the audio key field changes

## Phase 4: Verification

- [ ] 4.1 **localStorage cache**: Open DevTools, add/edit/delete a song, verify `JSON.parse` count drops to 1 per load (no redundant parses on CRUD)
- [ ] 4.2 **IndexedDB singleton**: Log `indexedDB.open` calls; verify only 1 call per session lifetime
- [ ] 4.3 **Song watcher**: Toggle transpose, confirm `loadAudio` is NOT called (log); toggle sections, confirm no chord regex re-run
- [ ] 4.4 **Cross-tab invalidation**: Open two tabs, edit song in one, verify the other reflects changes on window focus
