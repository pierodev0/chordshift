# ChordShift — Songbook PWA

Mobile-first PWA songbook for guitarists. Vue 3, Pinia, Tailwind v4, Firebase, pnpm.

## Setup

- Install deps: `pnpm install`
- Dev server: `pnpm dev`
- Production build: `pnpm build`
- Preview build: `pnpm preview`
- Run tests (watch): `pnpm test`
- Run tests (single): `pnpm test:run`

## Code style

- Pure JavaScript (no TypeScript)
- `function` declarations for named exports (no arrow functions)
- No semicolons, 2-space indent
- Single quotes in JS, double quotes in HTML templates
- Composables: named `use*`, return object, top-level in `<script setup>`
- Stores: Pinia setup syntax (`defineStore('name', () => { ... })`)
- UI strings in Spanish; code/comments/technical artifacts in English
- CSS: Tailwind utilities first; scoped `<style>` for custom CSS; OKLCH tokens via `var(--color-*)`
- Cross-component events: `window.dispatchEvent(new CustomEvent('chordshift-*'))`
- TabBar: placed in `App.vue` outside `<router-view>` with `fixed bottom-0` positioning; hidden on detail/editor views via `route.name` check in `showTabBar` computed
- IDs: `uuid()` from `src/utils/uuid.js`

## Firebase & sync gotchas

- `signInWithPopup` blocked on some browsers → fallback to `signInWithRedirect`
- OAuth redirect uses `window.location.origin + /__/auth/handler` — domain must be in Google Cloud Console OAuth client (Authorized JS origins + redirect URIs)
- Sync listener guard: `cloudData.deviceId === getDeviceId()` → skip (own writes)
- `_syncInitialSkip` skips first snapshot (local trigger from upload)
- `_syncedAt` timestamp prevents overwriting newer local data with stale cloud data
- Reference sync pattern: `practice-timer-v2/src/firebase/sync.js`
