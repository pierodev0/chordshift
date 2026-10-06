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
