<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center justify-between px-4 py-3.5 border-b border-border bg-white/80 backdrop-blur-sm">
      <h1 class="text-lg font-bold text-accent tracking-tight">ChordShift</h1>
      <span class="text-[10px] text-ink-subtle font-semibold uppercase tracking-widest">{{ store.sortedSongs.length }} canciones</span>
    </header>

    <div class="px-4 pt-3 pb-2">
      <AppInput v-model="query" type="search" placeholder="Buscar canciones...">
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </template>
      </AppInput>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-28">
      <EmptyState v-if="store.loaded && filtered.length === 0 && !query" />
      <div v-else-if="filtered.length === 0 && query" class="flex items-center justify-center h-full text-ink-soft text-sm">
        No se encontraron canciones para "{{ query }}"
      </div>
      <div v-else class="flex flex-col gap-3 pt-1">
        <div
          v-for="(song, i) in filtered"
          :key="song.id"
          class="animate-slide-up"
          :style="{ animationDelay: `${i * 50}ms` }"
        >
          <SongCard :song="song" />
        </div>
      </div>
    </div>

    <button
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white border-none shadow-xl shadow-accent/30 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/40 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-50"
      @click="$router.push({ name: 'song-new' })"
      aria-label="Agregar canción"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSongsStore } from '../stores/songsStore'
import AppInput from '../components/AppInput.vue'
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
