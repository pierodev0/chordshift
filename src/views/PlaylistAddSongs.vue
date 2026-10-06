<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader title="Agregar canciones" @back="goBack" />

    <div v-if="playlist" class="px-4 py-3 border-b border-border shrink-0">
      <p class="text-xs text-ink-soft">{{ playlist.name }} · {{ allSongs.length }} disponibles<span v-if="selectedIds.length > 0"> · {{ selectedIds.length }} seleccionadas</span></p>
    </div>

    <div class="px-4 pt-3 pb-2 shrink-0">
      <div class="relative">
        <AppInput v-model="searchQuery" type="search" placeholder="Buscar por nombre o artista...">
          <template #icon>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </template>
        </AppInput>
        <button
          v-if="searchQuery"
          class="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-border-light text-ink-soft flex items-center justify-center text-sm border-none cursor-pointer hover:bg-border transition-colors"
          @click="clearSearch"
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-6">
      <div v-if="!playlist" class="flex items-center justify-center h-full text-ink-soft text-sm">
        Lista no encontrada
      </div>
      <div v-else-if="allSongs.length === 0" class="flex items-center justify-center h-full text-ink-soft text-sm text-center px-8">
        No hay canciones disponibles. Creá algunas primero.
      </div>
      <div v-else-if="filteredSongs.length === 0" class="flex items-center justify-center h-full text-ink-soft text-sm text-center px-8">
        Sin resultados para "{{ searchQuery }}"
      </div>
      <div v-else class="flex flex-col">
        <div
          v-for="song in filteredSongs"
          :key="song.id"
          class="flex items-center gap-3 py-2.5 border-b border-border-light last:border-none rounded-xl px-2 -mx-2 cursor-pointer transition-colors"
          :class="selectedIds.includes(song.id) ? 'bg-accent-subtle' : 'hover:bg-white'"
          @click="toggleSong(song.id)"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-ink truncate">{{ song.title }}</p>
            <p v-if="song.artist" class="text-xs text-ink-soft truncate">{{ song.artist }}</p>
          </div>
          <button
            class="w-9 h-9 rounded-full border-none flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-all"
            :class="selectedIds.includes(song.id) ? 'bg-accent text-white' : 'bg-accent-subtle text-accent hover:bg-accent hover:text-white'"
            @click.stop="toggleSong(song.id)"
            :aria-label="(selectedIds.includes(song.id) ? 'Quitar ' : 'Seleccionar ') + song.title"
          >
            <svg v-if="selectedIds.includes(song.id)" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="playlist && allSongs.length > 0" class="px-4 py-3 border-t border-border bg-white shrink-0">
      <AppButton full size="lg" :disabled="selectedIds.length === 0" @click="saveSongs">
        ✓ Agregar ({{ selectedIds.length }})
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { usePlaylistsStore } from '../stores/playlistsStore'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppInput from '../components/AppInput.vue'
import AppButton from '../components/AppButton.vue'

const route = useRoute()
const router = useRouter()
const songsStore = useSongsStore()
const playlistsStore = usePlaylistsStore()

const searchQuery = ref('')
const selectedIds = ref([])

const playlist = computed(() => playlistsStore.getById(route.params.id))
const allSongs = computed(() => songsStore.sortedSongs.filter((s) => !playlist.value?.songIds.includes(s.id)))
const filteredSongs = computed(() => {
  if (!searchQuery.value.trim()) return allSongs.value
  const q = normalizeText(searchQuery.value.trim())
  return allSongs.value.filter((s) => normalizeText(s.title).includes(q) || normalizeText(s.artist).includes(q))
})

function normalizeText(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function clearSearch() {
  searchQuery.value = ''
}

function toggleSong(songId) {
  const i = selectedIds.value.indexOf(songId)
  if (i === -1) selectedIds.value.push(songId)
  else selectedIds.value.splice(i, 1)
}

function saveSongs() {
  for (const id of selectedIds.value) {
    playlistsStore.addSong(route.params.id, id)
  }
  selectedIds.value = []
  goBack()
}

function goBack() {
  router.push({ name: 'playlist-detail', params: { id: route.params.id } })
}

onMounted(() => {
  if (!songsStore.loaded) songsStore.load()
  if (!playlistsStore.loaded) playlistsStore.load()
})
</script>
