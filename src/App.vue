<template>
  <OfflineBanner />
  <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import OfflineBanner from './components/OfflineBanner.vue'
import { handleRedirectResult, observeAuth } from './firebase/auth.js'
import { downloadAndMergeState, startSyncListener, stopSyncListener, scheduleCloudSync } from './firebase/sync.js'
import { useSongsStore } from './stores/songsStore.js'
import { usePlaylistsStore } from './stores/playlistsStore.js'

const songsStore = useSongsStore()
const playlistsStore = usePlaylistsStore()

let unsubAuth = null
let unsubData = null

function applySyncData(merged) {
  if (!merged.changed) return
  if (merged.songs) songsStore.importAll(merged.songs)
  if (merged.playlists) playlistsStore.replaceAll(merged.playlists)
}

function onSyncUpdate(merged) {
  if (merged.songs) songsStore.importAll(merged.songs)
  if (merged.playlists) playlistsStore.replaceAll(merged.playlists)
}

onMounted(() => {
  songsStore.load()
  playlistsStore.load()

  handleRedirectResult().then((result) => {
    if (result?.user) {
      downloadAndMergeState().then(applySyncData).then(() => {
        startSyncListener(onSyncUpdate)
      }).catch((err) => console.error('Redirect sync error:', err))
    }
  }).catch(() => {})

  unsubAuth = observeAuth((u) => {
    if (u) {
      downloadAndMergeState().then(applySyncData).then(() => {
        startSyncListener(onSyncUpdate)
      }).catch((err) => console.error('Auth sync error:', err))
    } else {
      stopSyncListener()
    }
  })

  unsubData = () => {
    scheduleCloudSync()
  }
  window.addEventListener('chordshift-data-changed', unsubData)
})

onBeforeUnmount(() => {
  if (unsubAuth) unsubAuth()
  if (unsubData) window.removeEventListener('chordshift-data-changed', unsubData)
  stopSyncListener()
})
</script>

<style>
/* Hallmark · genre: playful · theme: custom (Plume+ · Sora + JetBrains Mono)
 * macrostructure: Mobile Songbook (enriched) · enrichment: none
 * pre-emit critique: P5 H5 E5 S5 R5 V5 */
.page-enter-active,
.page-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.page-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
