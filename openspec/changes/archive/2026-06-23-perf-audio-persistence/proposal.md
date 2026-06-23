# Proposal: Audio & Persistence Performance

## Intent

The app feels sluggish during common operations — every transpose click, song edit, playlist action, and navigation triggers expensive serialization, full data reloads, complete HTML re-renders, or unnecessary audio re-fetches. This change fixes the 4 root causes together.

## Scope

### In Scope
1. **localStorage persistence** — stop parsing/serializing the full dataset on every operation
2. **renderedHtml full recompute** — stop regenerating all HTML from scratch on every transpose or section toggle
3. **IndexedDB open/close on every call** — cache the connection instead
4. **Watch on `song` reloads audio unnecessarily** — only re-fetch audio when audio-relevant fields change

### Out of Scope
- Audio player behavior or UI changes
- Service worker or PWA caching strategy
- Adding a backend or sync layer
- Any feature work or UX changes

## Capabilities

> Pure refactor — no spec-level behavioral changes.

### New Capabilities
None

### Modified Capabilities
None

## Approach

1. **localStorageAdapter.js**: Introduce an in-memory cache of the parsed song list. `loadAll()` reads once and caches; `saveAll()` writes the cache back. Every mutation mutates the cache directly instead of re-reading from localStorage. Same pattern applied to **playlistsStore.js**.

2. **renderedHtml**: Split into two computed values: (a) a `cachedHtml` keyed by `song.value.content` (content + transpose are the only inputs that change the HTML), and (b) a thin `renderedHtml` that filters the cached lines by visibility. Section visibility changes no longer trigger chord regex + transposition.

3. **useAudioCache.js**: Hoist `openDB()` to a module-level singleton. Each function reuses the same DB connection instead of calling `indexedDB.open()` per call.

4. **SongDetail.vue**: Change `watch(song, ...)` to `watch(() => song.value?.audioKey, ...)` or use `{ deep: false }` + explicit field check, so metadata changes don't re-fetch audio.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/stores/adapters/localStorageAdapter.js` | Modified | In-memory cache, avoid full parse/serialize on every op |
| `src/stores/playlistsStore.js` | Modified | Same cache pattern as localStorageAdapter |
| `src/views/SongDetail.vue` | Modified | Memoize renderedHtml; narrow song watcher to audioKey |
| `src/composables/useAudioCache.js` | Modified | Cache IndexedDB connection across calls |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Stale in-memory cache if another tab mutates localStorage | Low | Add a `storage` event listener that invalidates cache on external changes |
| Connection leak from cached IndexedDB handle | Low | Keep connection alive; close on page unload via `window.onbeforeunload` |

## Rollback Plan

`git revert perf-audio-persistence` — each issue is an independent commit, so partial rollback is possible.

## Dependencies

None.

## Success Criteria

- [ ] Transpose click: time to re-render drops from ~Xms to <5ms (measured via `performance.now()` around `renderedHtml`)
- [ ] Song list load: time drops from O(n × full-serialize) to O(n × 1 read) (measured via `performance.mark()` around `store.load()`)
- [ ] Audio navigation between songs: only 1 `indexedDB.open()` per session, verified via counter
- [ ] Editing non-audio song fields (transpose, loops, markers): `loadAudio` is never called (verify via log)
