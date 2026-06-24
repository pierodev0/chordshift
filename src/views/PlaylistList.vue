<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center justify-between px-4 py-3.5 border-b border-border bg-white/80 backdrop-blur-sm shrink-0">
      <h1 class="text-lg font-bold text-accent tracking-tight">Listas</h1>
      <span v-if="store.loaded" class="text-[10px] text-ink-subtle font-semibold uppercase tracking-widest">{{ store.sortedPlaylists.length }} listas</span>
    </header>

    <div class="px-4 pt-3 pb-2 shrink-0">
      <AppInput v-model="query" type="search" placeholder="Buscar listas...">
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </template>
      </AppInput>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-20" style="padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px))">
      <div v-if="store.loaded && filtered.length === 0 && !query" class="flex flex-col items-center justify-center h-full text-center px-6">
        <div class="w-20 h-20 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-accent">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-ink mb-1">Todavía no tenés listas</h2>
        <p class="text-ink-soft text-sm max-w-[240px] leading-relaxed">
          Creá una lista para agrupar tus canciones por género, estado de ánimo o lo que quieras.
        </p>
      </div>
      <div v-else-if="filtered.length === 0 && query" class="flex items-center justify-center h-full text-ink-soft text-sm">
        No se encontraron listas para "{{ query }}"
      </div>
      <div v-else class="flex flex-col gap-3 pt-1">
        <div
          v-for="(pl, i) in filtered"
          :key="pl.id"
          class="animate-slide-up relative group"
          :style="{ animationDelay: `${i * 50}ms` }"
        >
          <PlaylistCard :playlist="pl" />
          <button
            class="absolute top-2 right-2 w-8 h-8 rounded-xl bg-white/90 hover:bg-red-50 text-red-400 hover:text-red-500 shadow-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            @click.stop="deletePlaylist(pl)"
            aria-label="Eliminar lista"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <button
      class="fixed bottom-[72px] right-6 w-14 h-14 rounded-full bg-accent text-white border-none shadow-xl shadow-accent/30 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/40 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-50"
      @click="$router.push({ name: 'playlist-new' })"
      aria-label="Crear lista"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlaylistsStore } from '../stores/playlistsStore'
import AppInput from '../components/AppInput.vue'
import PlaylistCard from '../components/PlaylistCard.vue'
const store = usePlaylistsStore()
const query = ref('')

const filtered = computed(() => {
  if (!query.value.trim()) return store.sortedPlaylists
  const q = query.value.toLowerCase()
  return store.sortedPlaylists.filter((p) => p.name.toLowerCase().includes(q))
})

function deletePlaylist(pl) {
  if (!confirm(`¿Eliminar "${pl.name}"?\nEsta acción no se puede deshacer.`)) return
  store.remove(pl.id)
}

onMounted(() => {
  if (!store.loaded) store.load()
})
</script>
