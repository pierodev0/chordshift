<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader :title="isEdit ? 'Editar canción' : 'Nueva canción'" @back="goBack" />

    <div class="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
      <AppInput v-model="title" label="Título" placeholder="Título de la canción" />
      <AppInput v-model="artist" label="Artista" placeholder="Nombre del artista" />
      <AppInput v-model="capo" label="Capo (cejilla)" placeholder="Ej: Capo 1, Capo 3..." />

      <div>
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Audio (mp3)</label>
        <div class="flex items-center gap-3 p-3 rounded-xl border border-border bg-white">
          <input
            ref="fileInput"
            type="file"
            accept="audio/*,.mp3"
            class="hidden"
            @change="onFileSelected"
          />
          <button
            class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent text-white border-none cursor-pointer hover:bg-accent-hover transition-colors shrink-0"
            @click="fileInput?.click()"
          >
            Seleccionar
          </button>
          <span class="text-xs text-ink-soft truncate">{{ selectedFileName || (existingAudioName ? 'Actual: ' + existingAudioName : 'Ningún archivo') }}</span>
          <span v-if="selectedFileName || existingAudioName" class="text-xs text-ink-subtle ml-auto cursor-pointer hover:text-accent transition-colors" @click="removeAudio">✕</span>
        </div>
      </div>

      <div>
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Video (YouTube)</label>
        <div class="flex items-center gap-3 p-3 rounded-xl border border-border bg-white">
          <input
            v-model="youtubeUrl"
            type="text"
            class="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <span v-if="youtubeUrl" class="shrink-0 text-sm font-bold">
            <span v-if="isValidYoutubeUrl(youtubeUrl)" class="text-green-500">✓</span>
            <span v-else class="text-red-400">✕</span>
          </span>
        </div>
      </div>

      <div>
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Scroll delay</label>
        <div class="flex items-center gap-2 mb-2">
          <button
            v-for="opt in delayOptions"
            :key="opt.value"
            class="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors cursor-pointer"
            :class="scrollDelay === opt.value ? 'bg-accent text-white border-accent' : 'bg-white text-ink border-border hover:bg-surface'"
            @click="scrollDelay = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <p class="text-[11px] text-ink-soft">
          Actual: <strong class="text-ink">{{ delayDisplay }}</strong>
          <template v-if="scrollDelay === 'auto'"> — se calcula al reproducir</template>
        </p>
      </div>

      <div class="flex-1 flex flex-col min-h-0">
        <label class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2 block">Letra y acordes</label>
        <textarea
          v-model="content"
          spellcheck="false"
          class="flex-1 min-h-[200px] w-full p-4 rounded-xl border border-border bg-white font-mono text-sm text-ink outline-none resize-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/15 placeholder:text-ink-subtle"
          placeholder="Pegá la letra con acordes. Ejemplo:
Fmaj7          Cadd9
Tanto tiempo disfrutamos..."
        />
      </div>
    </div>

    <div class="px-4 py-3 border-t border-border bg-white shrink-0">
      <AppButton full size="lg" shadow :disabled="!title.trim()" @click="save">
        Guardar
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { useAudioCache } from '../composables/useAudioCache'
import { isValidYoutubeUrl } from '../utils/youtube'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppInput from '../components/AppInput.vue'
import AppButton from '../components/AppButton.vue'

const { saveAudio } = useAudioCache()

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const isEdit = computed(() => route.name === 'song-edit')
const existing = computed(() => (isEdit.value ? store.getById(route.params.id) : null))

const fileInput = ref(null)
const title = ref('')
const artist = ref('')
const capo = ref('')
const content = ref('')
const selectedFile = ref(null)
const selectedFileName = ref('')
const existingAudioName = ref('')
const removeExistingAudio = ref(false)
const youtubeUrl = ref('')
const scrollDelay = ref('auto')

const delayDisplay = computed(() => {
  const v = scrollDelay.value
  if (v === 'auto') return 'Auto'
  return Number(v) + 's'
})

const delayOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 0, label: '0s' },
  { value: 1, label: '1s' },
  { value: 2, label: '2s' },
  { value: 3, label: '3s' },
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
]

function onFileSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  selectedFileName.value = file.name
}

function removeAudio() {
  selectedFile.value = null
  selectedFileName.value = ''
  if (existingAudioName.value) {
    existingAudioName.value = ''
    removeExistingAudio.value = true
  }
}

function goBack() {
  if (isEdit.value) {
    router.push({ name: 'song-detail', params: { id: route.params.id } })
  } else {
    router.push({ name: 'home' })
  }
}

async function save() {
  if (!title.value.trim()) return

  if (isEdit.value) {
    store.update(route.params.id, {
      title: title.value,
      artist: artist.value,
      capo: capo.value,
      content: content.value,
      youtubeUrl: youtubeUrl.value,
      scrollDelay: scrollDelay.value,
      audioKey: existingAudioName.value && !removeExistingAudio.value ? route.params.id : '',
    })
    if (selectedFile.value) {
      await saveAudio(route.params.id, selectedFile.value)
      store.update(route.params.id, { audioKey: route.params.id })
    } else if (removeExistingAudio.value) {
      const { deleteAudio } = useAudioCache()
      await deleteAudio(route.params.id)
    }
    router.push({ name: 'song-detail', params: { id: route.params.id } })
  } else {
    const song = store.create({
      title: title.value,
      artist: artist.value,
      capo: capo.value,
      content: content.value,
      youtubeUrl: youtubeUrl.value,
      scrollDelay: scrollDelay.value,
    })
    if (selectedFile.value) {
      await saveAudio(song.id, selectedFile.value)
      store.update(song.id, { audioKey: song.id })
    }
    router.push({ name: 'song-detail', params: { id: song.id } })
  }
}

onMounted(() => {
  if (!store.loaded) store.load()
  if (existing.value) {
    title.value = existing.value.title
    artist.value = existing.value.artist
    capo.value = existing.value.capo || ''
    content.value = existing.value.content
    if (existing.value.audioKey) {
      existingAudioName.value = 'audio.mp3'
    }
    youtubeUrl.value = existing.value.youtubeUrl || ''
    scrollDelay.value = existing.value.scrollDelay !== undefined ? existing.value.scrollDelay : 'auto'
  }
})
</script>
