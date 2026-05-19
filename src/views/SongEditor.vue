<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center gap-3 px-4 py-3.5 bg-white/80 backdrop-blur-sm border-b border-border shrink-0">
      <button
        class="w-9 h-9 rounded-xl hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center -ml-1"
        @click="goBack"
        aria-label="Volver"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-ink">
          <path d="M19 12H5m7 7-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-sm font-semibold text-ink truncate">
        {{ isEdit ? 'Editar canción' : 'Nueva canción' }}
      </h1>
    </header>

    <div class="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
      <div>
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Título</label>
        <input
          v-model="title"
          type="text"
          placeholder="Título de la canción"
          class="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-ink outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-accent/10 placeholder:text-ink-subtle"
        />
      </div>

      <div>
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Artista</label>
        <input
          v-model="artist"
          type="text"
          placeholder="Nombre del artista"
          class="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-ink outline-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-accent/10 placeholder:text-ink-subtle"
        />
      </div>

      <div class="flex-1 flex flex-col min-h-0">
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Letra y acordes</label>
        <textarea
          v-model="content"
          spellcheck="false"
          class="flex-1 min-h-[200px] w-full p-4 rounded-xl border border-border bg-white font-mono text-sm text-ink outline-none resize-none transition-all duration-200 focus:border-accent focus:ring-3 focus:ring-accent/10 placeholder:text-ink-subtle"
          placeholder="Pegá la letra con acordes. Ejemplo:
Fmaj7          Cadd9
Tanto tiempo disfrutamos..."
        />
      </div>
    </div>

    <div class="px-4 py-3 border-t border-border bg-white shrink-0">
      <button
        class="w-full py-3.5 rounded-xl font-semibold bg-accent text-white border-none transition-all duration-200 hover:bg-accent-hover active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
        :disabled="!title.trim()"
        @click="save"
      >
        Guardar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const isEdit = computed(() => route.name === 'song-edit')
const existing = computed(() => (isEdit.value ? store.getById(route.params.id) : null))

const title = ref('')
const artist = ref('')
const content = ref('')

function goBack() {
  if (isEdit.value) {
    router.push({ name: 'song-detail', params: { id: route.params.id } })
  } else {
    router.push({ name: 'home' })
  }
}

function save() {
  if (!title.value.trim()) return

  if (isEdit.value) {
    store.update(route.params.id, {
      title: title.value,
      artist: artist.value,
      content: content.value,
    })
    router.push({ name: 'song-detail', params: { id: route.params.id } })
  } else {
    const song = store.create({
      title: title.value,
      artist: artist.value,
      content: content.value,
    })
    router.push({ name: 'song-detail', params: { id: song.id } })
  }
}

onMounted(() => {
  if (!store.loaded) store.load()
  if (existing.value) {
    title.value = existing.value.title
    artist.value = existing.value.artist
    content.value = existing.value.content
  }
})
</script>
