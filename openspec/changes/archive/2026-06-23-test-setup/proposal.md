# Proposal: Test Infrastructure Setup

## Intent

Add Vitest + @vue/test-utils + happy-dom as the project's test runner and utilities. Currently the project has zero tests, and `config.yaml` marks all testing layers as `false`. This change lays the foundation for unit and integration tests across the codebase, starting with three targeted test suites.

## Scope

### In Scope
- Install `vitest`, `@vue/test-utils`, `happy-dom` as devDependencies
- Configure `vite.config.js` with `happy-dom` test environment
- Add `test` script (`vitest run`) and `test:watch` script (`vitest`) to `package.json`
- Write tests for `useChordTransposer` (pure functions: `isChordLine`, `transposeNote`, `escapeHTML`)
- Write tests for `songsStore` (Pinia store backed by `localStorageAdapter`)
- Write tests for `playlistsStore` (Pinia store with direct localStorage)

### Out of Scope
- Component tests (future work after store and utility coverage is established)
- E2E tests (Playwright/Cypress not in scope)
- Code coverage configuration or CI integration
- Refactoring existing code for testability

## Capabilities

### New Capabilities
- None (infrastructure-only change — no spec-level behavior changes)

### Modified Capabilities
- None

## Approach

1. **Install** `vitest`, `@vue/test-utils`, `happy-dom` via pnpm
2. **Configure** a `test` block in `vite.config.js` using `happy-dom` as the environment
3. **Add scripts** `test` (run once) and `test:watch` (watch mode) to `package.json`
4. **Write `src/composables/__tests__/useChordTransposer.test.js`** — test `isChordLine` (chord-only lines, mixed lines, empty), `transposeNote` (# and b accidentals, wrapping), `escapeHTML` (all 5 entities)
5. **Write `src/stores/__tests__/songsStore.test.js`** — create a Pinia instance with a fake `localStorageAdapter` mock; test CRUD operations, `sortedSongs`, `loaded` state
6. **Write `src/stores/__tests__/playlistsStore.test.js`** — test `addSong`/`removeSong`, sorted order, persistence calls, empty state

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add devDependencies + test scripts |
| `vite.config.js` | Modified | Add `test` config block |
| `src/composables/__tests__/useChordTransposer.test.js` | New | Transposer unit tests |
| `src/stores/__tests__/songsStore.test.js` | New | Songs store unit tests |
| `src/stores/__tests__/playlistsStore.test.js` | New | Playlists store unit tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `localStorageAdapter` cache (`_cache`) breaks between tests | Low | Reset adapter state before each test via `vi.resetModules()` |
| Pinia v3 API differences with test utils | Low | Install matching versions; test on first run |

## Rollback Plan

```bash
pnpm remove vitest @vue/test-utils happy-dom
# Revert vite.config.js and package.json changes
```

## Dependencies

- None (all three packages install independently)

## Success Criteria

- [ ] `pnpm test` passes with all three test suites green
- [ ] `pnpm test:watch` starts in watch mode without errors
- [ ] Tests run headlessly in CI-like environment (no browser needed)
- [ ] Store tests mock localStorage and do not leak state between tests
