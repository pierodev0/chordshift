# ChordShift — Songbook PWA

Mobile-first PWA songbook for guitarists. Vue 3, Pinia, Tailwind v4, Firebase, pnpm.

## Code exploration

- Use `codegraph_explore` via `execute` first for: how does X work, architecture, bugs, where/what to edit. Always pass `projectPath` = repo root (this server has no default project). Treat its output as already Read; do not re-read those files.
- Use `read`/`grep`/`glob` directly only for listing directories or reading a specific already-known file.

## Language

- Use `GLOSSARY.md` for domain terms (Canción, Lista).
- UI strings in Spanish, code/comments/technical artifacts in English.

## Setup & verify

- Dev with `pnpm dev` (scripts in `package.json` are source of truth).
- Verify every change with `pnpm test:run` and `pnpm build` green.

## Testing

- Runner: Vitest with `happy-dom` + `globals: true` (`vite.config.js` is source of truth).
- Co-locate specs as `__tests__/<name>.spec.js` next to the unit under test.
- Unit-test pure logic directly (e.g. `useChordTransposer`, `clampSemitones`); mock externals with `vi.mock` (e.g. `tone` in `useAudioPitch.spec.js`).
- Component specs use `@vue/test-utils` + mocked router only where needed (see `SongCard.spec.js`).
- Commands: `pnpm test:run` for full suite, `pnpm vitest run <path>` for a single spec file. Never pass `--reporter=basic` (unsupported flag breaks the run).

## Code style

- Pure JavaScript with `function` declarations for named exports, no semicolons, 2-space indent.
- Single quotes in JS, double quotes in HTML templates.
- Composables named `use*` returning object, top-level in `<script setup>`.
- Stores with Pinia setup syntax (`defineStore('name', () => { ... })`).
- CSS Tailwind utilities first, scoped `<style>` for custom CSS, OKLCH tokens via `var(--color-*)`.
- Cross-component events via `window.dispatchEvent(new CustomEvent('chordshift-*'))`.
- TabBar lives in `App.vue` outside `<router-view>` with `fixed bottom-0`, hidden on detail/editor via `route.name` in `showTabBar`.
- IDs via `uuid()` from `src/utils/uuid.js`.

## Firebase

- Auth uses `signInWithPopup` with `signInWithRedirect` fallback on `auth/popup-blocked`. On `redirect_uri_mismatch` in production read `docs/firebase-auth-vercel.md`.
- Sync guards: skip own writes (`cloudData.deviceId === getDeviceId()`), skip first snapshot (`_syncInitialSkip`), never overwrite newer local data (`_syncedAt`).
- Reference sync pattern: `practice-timer-v2/src/firebase/sync.js`.
