# Tasks: YouTube Video Integration

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~185–200 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Full YouTube integration | PR 1 | All files; single atomic change, no PR split needed |

## Phase 1: Infrastructure

- [x] 1.1 Create `src/utils/youtube.js` — `extractYoutubeId(url)` returning video ID or null, `isValidYoutubeUrl(url)` boolean guard
- [x] 1.2 Create `src/composables/useYoutubePlayer.js` — singleton YT IFrame API loader, `createPlayer(containerId, videoId, callbacks)`, player lifecycle (destroy, pause, seekTo, getCurrentTime)

## Phase 2: Store & Editor

- [x] 2.1 Modify `src/stores/songsStore.js` — add `youtubeUrl: ''` to the `create()` return object
- [x] 2.2 Modify `src/views/SongEditor.vue` — add text input for YouTube URL below MP3 section, bind to `youtubeUrl`, include in `save()` payload for both create and edit flows

## Phase 3: Player Component & Detail Integration

- [x] 3.1 Create `src/components/YoutubePlayer.vue` — accepts `videoId` prop, renders YT iframe via `useYoutubePlayer`, emits `timeupdate`, `play`, `pause`, `ready` events
- [x] 3.2 Modify `src/views/SongDetail.vue` — import and render `<YoutubePlayer>` when `song.youtubeUrl` is set, alongside existing `<AudioPlayer>`; pass timeupdate events to autoscroll logic

## Phase 4: Tests & Verify

- [x] 4.1 Create `src/utils/__tests__/youtube.spec.js` — test `extractYoutubeId` with standard, shortened, embedded, and invalid URLs
- [x] 4.2 Verify: new song with YouTube URL saves/loads correctly, YT player renders in SongDetail, autoscroll works from YT timeupdate
