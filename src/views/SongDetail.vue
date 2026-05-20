<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader title="Canción" @back="router.push({ name: 'home' })">
      <template #actions>
        <AppIconButton
          v-if="song"
          @click="deleteSong"
          aria-label="Eliminar"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-400">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
          </svg>
        </AppIconButton>
        <AppIconButton
          v-if="song"
          @click="router.push({ name: 'song-edit', params: { id: song.id } })"
          aria-label="Editar"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink-soft">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </AppIconButton>
      </template>
    </AppPageHeader>

    <template v-if="song">
      <AudioPlayer
        :audioUrl="audioUrl"
        :totalLines="totalLines"
        :autoScrolling="autoScrolling"
        @toggleAutoScroll="autoScrolling = !autoScrolling"
        @loaded="songDuration = $event"
      />

      <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 scroll-smooth">
        <div class="pt-4 pb-1">
          <h1 class="text-2xl font-bold text-ink leading-tight">{{ song.title }}</h1>
          <p v-if="song.artist" class="text-ink-soft text-sm mt-0.5">{{ song.artist }}</p>
          <p v-if="song.capo" class="text-accent text-xs mt-1 font-semibold">{{ formatCapo(song.capo) }}</p>
        </div>

        <div class="pb-2">
          <ChordLegend :chords="chords" />
        </div>

        <div class="font-mono text-sm leading-relaxed whitespace-pre-wrap pb-24" v-html="renderedHtml" />
      </div>

      <button
        class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white border-none shadow-xl shadow-accent/30 transition-all duration-200 hover:bg-accent-hover hover:shadow-accent/40 active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-40"
        @click="showSheet = true"
        aria-label="Transponer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>

      <button
        v-if="sections.length > 0"
        class="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-white border border-border text-ink shadow-xl transition-all duration-200 hover:bg-surface hover:shadow-md active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-40"
        @click="showSectionSheet = true"
        aria-label="Secciones"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>

      <TransposeSheet :show="showSheet" :keyText="keyText" @close="showSheet = false" @transpose="changeTranspose" />

      <SectionNavSheet
        v-if="sections.length > 0"
        :show="showSectionSheet"
        :sections="sections"
        :visibility="sectionVisibility"
        @close="showSectionSheet = false"
        @toggle="toggleSection"
        @toggleAll="toggleAllSections"
      />
    </template>

    <div v-else class="flex-1 flex items-center justify-center text-ink-soft text-sm">
      Canción no encontrada
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { useChordTransposer } from '../composables/useChordTransposer'
import { useAudioCache } from '../composables/useAudioCache'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppIconButton from '../components/AppIconButton.vue'
import ChordLegend from '../components/ChordLegend.vue'
import AudioPlayer from '../components/AudioPlayer.vue'
import TransposeSheet from '../components/TransposeSheet.vue'
import SectionNavSheet from '../components/SectionNavSheet.vue'

const { chordRegex, isChordLine, transposeNote, escapeHTML } = useChordTransposer()
const { loadAudio, deleteAudio } = useAudioCache()

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const showSheet = ref(false)
const showSectionSheet = ref(false)
const currentStep = ref(0)
const sectionVisibility = ref({})
const audioUrl = ref(null)
const autoScrolling = ref(true)
const songDuration = ref(0)
const scrollContainer = ref(null)

const song = computed(() => store.getById(route.params.id))

watch(() => route.params.id, () => {
  showSheet.value = false
  showSectionSheet.value = false
  autoScrolling.value = false
  audioUrl.value = null
})

watch(song, (newSong) => {
  if (newSong) {
    currentStep.value = newSong.transpose || 0
  }
}, { immediate: true })

watch(currentStep, (step) => {
  if (song.value) {
    store.update(song.value.id, { transpose: step })
  }
})

// --- Audio ---
async function loadSongAudio() {
  if (!song.value?.audioKey) return
  const result = await loadAudio(song.value.id)
  if (result) {
    if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
    audioUrl.value = result.url
  }
}

watch(song, () => { loadSongAudio() }, { immediate: true })

async function deleteSong() {
  if (!song.value) return
  if (!confirm('¿Eliminar canción?\nEsta acción no se puede deshacer.')) return
  const id = song.value.id
  if (song.value.audioKey) {
    await deleteAudio(id)
  }
  store.remove(id)
  router.push({ name: 'home' })
}

onBeforeUnmount(() => {
  if (audioUrl.value) URL.revokeObjectURL(audioUrl.value)
})

const totalLines = computed(() => song.value?.content.split('\n').length || 0)

// --- Sections ---
const sections = computed(() => {
  if (!song.value) return []
  const lines = song.value.content.split('\n')
  const result = []
  let currentLabel = 'Intro'
  let start = 0

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^\[(.+)\]$/)
    if (match) {
      if (i > start) {
        result.push({ id: `sec-${result.length}`, label: currentLabel, start, count: i - start })
      }
      currentLabel = match[1]
      start = i
    }
  }
  if (lines.length > start) {
    result.push({ id: `sec-${result.length}`, label: currentLabel, start, count: lines.length - start })
  }

  return result
})

watch(sections, (secs) => {
  const vis = { ...sectionVisibility.value }
  for (const sec of secs) {
    if (vis[sec.id] === undefined) vis[sec.id] = true
  }
  sectionVisibility.value = vis
}, { immediate: true })

const visibleLineRanges = computed(() => {
  const ranges = []
  for (const sec of sections.value) {
    if (sectionVisibility.value[sec.id] !== false) {
      ranges.push({ start: sec.start, end: sec.start + sec.count })
    }
  }
  return ranges
})

function lineIsVisible(lineIdx) {
  return visibleLineRanges.value.some((r) => lineIdx >= r.start && lineIdx < r.end)
}

// --- Transpose ---
const keyText = computed(() =>
  currentStep.value === 0
    ? 'Tono Original'
    : 'Original → ' + (currentStep.value > 0 ? '+' : '') + currentStep.value,
)

const renderedHtml = computed(() => {
  if (!song.value) return ''
  const lines = song.value.content.split('\n')
  const rendered = []

  for (let i = 0; i < lines.length; i++) {
    if (!lineIsVisible(i)) continue

    const line = lines[i]
    let processed
    if (isChordLine(line)) {
      processed = line.replace(chordRegex, (match, root, bass) => {
        const transRoot = transposeNote(root, currentStep.value)
        const transBass = bass ? '/' + transposeNote(bass, currentStep.value) : ''
        return `<strong>${transRoot}${transBass}</strong>`
      })
    } else {
      processed = escapeHTML(line)
    }
    rendered.push(`<div id="line-${i}">${processed}</div>`)
  }

  return rendered.join('')
})

const chords = computed(() => {
  if (!song.value) return []
  const set = new Set()
  const lines = song.value.content.split('\n')
  for (const line of lines) {
    if (isChordLine(line)) {
      line.replace(chordRegex, (_match, root, bass) => {
        const transRoot = transposeNote(root, currentStep.value)
        const transBass = bass ? '/' + transposeNote(bass, currentStep.value) : ''
        set.add(transRoot + transBass)
      })
    }
  }
  return [...set]
})

function changeTranspose(delta) {
  currentStep.value += delta
}

function toggleSection(id) {
  sectionVisibility.value = { ...sectionVisibility.value, [id]: !sectionVisibility.value[id] }
}

function toggleAllSections(currentlyAllVisible) {
  const newVal = !currentlyAllVisible
  const vis = {}
  for (const sec of sections.value) {
    vis[sec.id] = newVal
  }
  sectionVisibility.value = vis
}

function formatCapo(val) {
  return /^\d+$/.test(val) ? 'Capo ' + val : val
}

onMounted(() => {
  if (!store.loaded) store.load()
})
</script>
