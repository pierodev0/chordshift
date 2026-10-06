<template>
  <div class="h-dvh flex flex-col bg-paper">
    <div class="flex-1 overflow-y-auto pb-20" style="padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px))">
      <section class="px-4 pt-6 pb-5 bg-accent text-white">
        <h1 class="text-2xl font-bold tracking-tight">ChordShift</h1>
        <p class="text-sm mt-1 text-white/85">Tu cancionero para guitarra</p>
        <p class="text-[11px] mt-2 font-semibold uppercase tracking-widest text-white/70">
          {{ songsStore.songs.length }} canciones · {{ totalPlays }} toques
        </p>
      </section>

      <section class="px-4 pt-4">
        <h2 class="text-sm font-bold text-ink uppercase tracking-widest mb-2">Más tocadas</h2>
        <div v-if="songsStore.loaded && songsStore.songs.length === 0" class="py-2">
          <EmptyState />
        </div>
        <div v-else-if="top.length === 0" class="bg-white rounded-xl border border-border p-4 text-center">
          <p class="text-sm text-ink-soft">Todavía no hay toques.</p>
          <p class="text-sm text-ink-soft mb-3">Tocá tu primera canción y vas a verla acá.</p>
          <AppButton size="lg" @click="$router.push({ name: 'songs' })">
            Ver canciones
          </AppButton>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(song, i) in top"
            :key="song.id"
            class="animate-slide-up"
            :style="{ animationDelay: `${i * 50}ms` }"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-lg font-bold text-accent tabular-nums w-7 shrink-0 text-center">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <SongCard :song="song" from="home" />
                <p class="text-[11px] text-ink-soft mt-1 ml-0.5">
                  {{ song.playCount }} {{ song.playCount === 1 ? 'toque' : 'toques' }} · {{ formatRelativeTime(song.lastPlayedAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="px-4 pt-4 grid grid-cols-2 gap-3">
        <button
          class="bg-white rounded-xl border border-border p-4 text-left cursor-pointer hover:shadow-md transition-shadow"
          @click="$router.push({ name: 'songs' })"
        >
          <p class="font-semibold text-ink text-sm">Canciones</p>
          <p class="text-ink-soft text-xs mt-0.5">{{ songsStore.songs.length }} en tu cancionero</p>
        </button>
        <button
          class="bg-white rounded-xl border border-border p-4 text-left cursor-pointer hover:shadow-md transition-shadow"
          @click="$router.push({ name: 'playlists' })"
        >
          <p class="font-semibold text-ink text-sm">Listas</p>
          <p class="text-ink-soft text-xs mt-0.5">{{ playlistsStore.playlists.length }} para practicar</p>
        </button>
      </section>

      <section class="px-4 pt-4">
        <AppButton full size="lg" @click="$router.push({ name: 'song-new' })">
          Agregar canción
        </AppButton>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSongsStore } from '../stores/songsStore'
import { usePlaylistsStore } from '../stores/playlistsStore'
import { formatRelativeTime } from '../utils/relativeTime'
import SongCard from '../components/SongCard.vue'
import EmptyState from '../components/EmptyState.vue'
import AppButton from '../components/AppButton.vue'

const songsStore = useSongsStore()
const playlistsStore = usePlaylistsStore()

const top = computed(() => songsStore.mostPlayed)
const totalPlays = computed(() => songsStore.songs.reduce((acc, s) => acc + (s.playCount || 0), 0))

onMounted(() => {
  if (!songsStore.loaded) songsStore.load()
  if (!playlistsStore.loaded) playlistsStore.load()
})
</script>
