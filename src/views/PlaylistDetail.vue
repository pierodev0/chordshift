<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader :title="playlist?.name || 'Lista'" @back="router.push({ name: 'playlists' })">
      <template #actions>
        <AppIconButton
          v-if="playlist"
          @click="deletePlaylist"
          aria-label="Eliminar lista"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-400">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </AppIconButton>
        <AppIconButton
          v-if="playlist"
          @click="editing = !editing"
          :aria-label="editing ? 'Terminar' : 'Editar'"
        >
          <svg v-if="!editing" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink-soft">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
          <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-accent">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </AppIconButton>
      </template>
    </AppPageHeader>

    <template v-if="playlist">
      <div class="px-4 py-3 border-b border-border shrink-0">
        <p class="text-xs text-ink-soft">{{ playlist.songIds.length }} canciones</p>
      </div>

      <div v-if="playlist.songIds.length === 0" class="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div class="w-20 h-20 rounded-2xl bg-accent-subtle flex items-center justify-center mb-4">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-accent">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <h2 class="text-lg font-semibold text-ink mb-1">Lista vacía</h2>
        <p class="text-ink-soft text-sm max-w-[240px] leading-relaxed">
          Agregá canciones a esta lista para empezar a practicar.
        </p>
      </div>

      <div v-else class="flex-1 overflow-y-auto px-4 pb-4">
        <draggable
          v-model="dragItems"
          item-key="id"
          tag="div"
          class="flex flex-col gap-3 pt-3"
          :disabled="!editing"
          :handle="editing ? '.drag-handle' : undefined"
          @end="saveOrder"
        >
          <template #item="{ element }">
            <div class="flex items-center gap-2 group/item">
              <div
                v-if="editing"
                class="drag-handle w-9 h-9 rounded-xl flex items-center justify-center text-ink-subtle cursor-grab active:cursor-grabbing hover:bg-accent-subtle transition-colors shrink-0 touch-none"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="5" cy="3" r="1.5"/>
                  <circle cx="11" cy="3" r="1.5"/>
                  <circle cx="5" cy="8" r="1.5"/>
                  <circle cx="11" cy="8" r="1.5"/>
                  <circle cx="5" cy="13" r="1.5"/>
                  <circle cx="11" cy="13" r="1.5"/>
                </svg>
              </div>
              <div class="relative flex-1 min-w-0">
                <SongCard v-if="getSong(element.id)" :song="getSong(element.id)" :playlistId="playlist.id" />
                <div v-else class="bg-white rounded-xl border border-border p-4 text-ink-subtle text-sm">
                  Canción eliminada
                </div>
                <button
                  v-if="editing"
                  class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-sm shadow-md cursor-pointer border-none hover:bg-red-600 transition-colors z-10"
                  @click.stop="removeSong(element.id)"
                  aria-label="Quitar canción"
                >
                  ×
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </div>

      <button
        class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white border-none shadow-xl shadow-accent/30 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/40 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-40"
        @click="goToAddSongs"
        aria-label="Agregar canciones"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </template>

    <div v-else class="flex-1 flex items-center justify-center text-ink-soft text-sm">
      Lista no encontrada
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { usePlaylistsStore } from '../stores/playlistsStore'
import draggable from 'vuedraggable'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppIconButton from '../components/AppIconButton.vue'
import SongCard from '../components/SongCard.vue'

const route = useRoute()
const router = useRouter()
const songsStore = useSongsStore()
const playlistsStore = usePlaylistsStore()

const editing = ref(false)

const playlist = computed(() => playlistsStore.getById(route.params.id))

const dragItems = ref([])
let syncing = false

watch(playlist, (pl) => {
  if (syncing) return
  if (pl) {
    dragItems.value = pl.songIds.map((id) => ({ id }))
  } else {
    dragItems.value = []
  }
}, { immediate: true })

function saveOrder() {
  if (!playlist.value) return
  const newOrder = dragItems.value.map((item) => item.id)
  syncing = true
  playlistsStore.update(playlist.value.id, { songIds: newOrder })
  syncing = false
}

function getSong(id) {
  return songsStore.getById(id)
}

function goToAddSongs() {
  router.push({ name: 'playlist-add-songs', params: { id: route.params.id } })
}

function removeSong(songId) {
  playlistsStore.removeSong(route.params.id, songId)
}

function deletePlaylist() {
  if (!playlist.value) return
  if (!confirm('¿Eliminar lista?\nEsta acción no se puede deshacer.')) return
  playlistsStore.remove(playlist.value.id)
  router.push({ name: 'playlists' })
}

onMounted(() => {
  if (!songsStore.loaded) songsStore.load()
  if (!playlistsStore.loaded) playlistsStore.load()
})
</script>
