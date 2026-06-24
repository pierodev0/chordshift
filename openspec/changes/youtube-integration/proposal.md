# Proposal: YouTube Video Integration

## Intent

Let guitarists practice songs directly from YouTube videos with synchronized autoscroll — no need to download MP3s separately. The YT player sits in the same spot as the existing AudioPlayer, above the lyrics, and can coexist with an MP3 source.

## Scope

### In Scope
- `youtubeUrl` field added to song model (optional, coexists with `audioKey`)
- YouTube URL input in SongEditor (text field alongside MP3 file picker)
- YouTubePlayer component with play/pause, seek, timestamp display, speed control
- Autoscroll synchronization via YT player timeupdate events
- YT IFrame API loaded globally once via script tag on app mount

### Out of Scope
- Playlist or batch YT URL import
- YT search inside the app
- Download/offline YT audio
- Audio Lab integration for YT sources
- Loop range support for YT (deferred)

## Capabilities

### New Capabilities
- `youtube-player`: Embed, control, and synchronize YouTube videos with song lyrics

### Modified Capabilities
None (no existing specs to modify).

## Approach

1. **Song model**: Add optional `youtubeUrl` string field to `songsStore.create()` and persistence.
2. **SongEditor**: Add a text input for YouTube URL below the MP3 file picker. Store as `youtubeUrl`.
3. **YouTubePlayer component** (`src/components/YoutubePlayer.vue`):
   - Parses video ID from URL via `extractYoutubeId()` utility: `/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/`
   - Takes `videoId` (extracted 11-char ID), `totalLines`, `autoScrolling` props
   - Creates `YT.Player` in a container div using YouTube IFrame API
   - Emits `timeupdate(currentTime, duration)` events for autoscroll
   - Exposes play/pause integration via YT API
4. **SongDetail — Source tabs**: When a song has both MP3 and YouTube, render a tab bar (`[🎵 MP3] [▶ YouTube]`) above the player area. Only the active tab's player is rendered. When only one source exists, no tabs — just the single player.
5. **YT IFrame API**: Loaded lazily on first `useYoutubePlayer()` call via singleton pattern, not on app mount.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/stores/songsStore.js` | Modified | Add `youtubeUrl` field to `create()` and `update()` |
| `src/views/SongEditor.vue` | Modified | Add YT URL input; pass `youtubeUrl` to save |
| `src/views/SongDetail.vue` | Modified | Pass `youtubeUrl` to player area; manage dual-player state |
| `src/components/YoutubePlayer.vue` | **New** | YouTube IFrame Player wrapper, emits timeupdate |
| `src/composables/useYoutubePlayer.js` | **New** | Singleton YT IFrame API loader + player lifecycle |
| `src/utils/youtube.js` | **New** | `extractYoutubeId()`, `isValidYoutubeUrl()` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| YouTube IFrame API rate limits or blocking | Low | Graceful fallback: show error message, keep MP3 player functional |
| Invalid/malformed YT URL | Low | Regex validation + paste feedback |
| YT video unavailable (age-restricted, private) | Low | Player fires error event → show inline error |
| YT API breaking changes | Low | Well-established API; isolated in single component |

## Rollback Plan

1. Remove `youtubeUrl` field from `songsStore.create()` — existing songs with `youtubeUrl` silently ignore it.
2. Revert `SongEditor.vue` — remove YT URL input.
3. Delete `YouTubePlayer.vue` component.
4. Revert `SongDetail.vue` — restore single AudioPlayer usage.
5. Revert `main.js` — remove YT IFrame API script injection.

## Dependencies

- YouTube IFrame Player API (external, loaded via `<script>` at runtime)

## Success Criteria

- [ ] User pastes a YouTube URL in SongEditor → saved to song
- [ ] On SongDetail view, YT player renders above lyrics with play/pause
- [ ] Source tabs let user switch between MP3 and YouTube when both sources exist
- [ ] Playing the YT video triggers autoscroll through lyrics
- [ ] Invalid YT URL shows clear error state
