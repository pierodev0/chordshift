<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
      <h1 class="text-lg font-semibold text-accent tracking-tight">ChordShift</h1>
      <div class="w-5" />
    </header>

    <div class="px-4 py-3">
      <div class="relative">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          v-model="query"
          type="search"
          placeholder="Buscar canciones..."
          class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-ink outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-24">
      <EmptyState v-if="store.loaded && filtered.length === 0 && !query" />
      <div v-else-if="filtered.length === 0 && query" class="text-center py-12 text-ink-soft text-sm">
        No se encontraron canciones para "{{ query }}"
      </div>
      <div v-else class="flex flex-col gap-3">
        <SongCard v-for="song in filtered" :key="song.id" :song="song" />
      </div>
    </div>

    <button
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white border-none shadow-lg transition-all duration-200 hover:bg-accent-hover active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-50"
      @click="$router.push({ name: 'song-new' })"
      aria-label="Agregar canción"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSongsStore } from '../stores/songsStore'
import SongCard from '../components/SongCard.vue'
import EmptyState from '../components/EmptyState.vue'

const store = useSongsStore()
const query = ref('')

const filtered = computed(() => {
  if (!query.value.trim()) return store.sortedSongs
  const q = query.value.toLowerCase()
  return store.sortedSongs.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q),
  )
})

onMounted(() => {
  if (!store.loaded) store.load()
})
</script>
