# Tasks: Test Infrastructure Setup

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 100–150 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

Decision needed before apply: Yes
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Install Vitest + configure + write 3 test suites | PR 1 | Single PR; <100 lines tests, ~50 config |

## Phase 1: Infrastructure / Dependencies

- [x] 1.1 Install `vitest`, `@vue/test-utils`, `happy-dom` as devDependencies via `pnpm add -D`
- [x] 1.2 Add `test` config block to `vite.config.js` with `environment: 'happy-dom'`
- [x] 1.3 Add `test` (`vitest run`) and `test:watch` (`vitest`) scripts to `package.json`

## Phase 2: Pure Function Tests

- [x] 2.1 Create `src/composables/__tests__/useChordTransposer.spec.js` — test `isChordLine` (chord-only lines, mixed, empty), `transposeNote` (# and b accidentals, wrapping by ±12), `escapeHTML` (all 5 HTML entities)

## Phase 3: Store Tests

- [x] 3.1 Create `src/stores/__tests__/songsStore.spec.js` — mock `localStorageAdapter` via `vi.mock`; test `create`, `update`, `remove`, `getById`, `sortedSongs`, `loaded` state (5–7 tests)
- [x] 3.2 Create `src/stores/__tests__/playlistsStore.spec.js` — mock `localStorage` directly; test `addSong`, `removeSong`, `sortedPlaylists`, persistence, empty state (3–5 tests)

## Phase 4: Verification

- [x] 4.1 Run `pnpm test` and fix any failures
