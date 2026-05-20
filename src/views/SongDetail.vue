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
        :showLab="!!song?.audioKey"
        :loopRange="activeLoopRange"
        @toggleAutoScroll="autoScrolling = !autoScrolling"
        @loaded="songDuration = $event"
        @openLab="router.push({ name: 'song-audio', params: { id: song.id } })"
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

        <div class="font-mono text-sm leading-relaxed whitespace-pre-wrap" :class="markers.length > 0 || validLoops.length > 0 ? 'pb-40' : 'pb-24'" v-html="renderedHtml" />
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

      <button
        v-if="markers.length > 0 || validLoops.length > 0"
        class="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-white border border-border text-ink shadow-xl transition-all duration-200 hover:bg-surface hover:shadow-md active:scale-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none flex items-center justify-center cursor-pointer z-40"
        :class="loopEnabled ? 'text-accent border-accent bg-accent-subtle' : ''"
        @click="showLoopSheet = true"
        aria-label="Bucles"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
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

      <AppBottomSheet :show="showLoopSheet" @close="showLoopSheet = false">
        <template #title>
          <p class="text-center text-xs font-bold text-ink-soft tracking-widest uppercase mb-4">Bucles</p>
        </template>

        <div class="flex mb-4 bg-surface rounded-xl p-0.5">
          <button
            class="flex-1 py-2 text-xs font-semibold rounded-lg border-none cursor-pointer transition-colors"
            :class="loopTab === 'markers' ? 'bg-white text-ink shadow-sm' : 'bg-transparent text-ink-soft hover:text-ink'"
            @click="loopTab = 'markers'"
          >Marcadores</button>
          <button
            class="flex-1 py-2 text-xs font-semibold rounded-lg border-none cursor-pointer transition-colors"
            :class="loopTab === 'saved' ? 'bg-white text-ink shadow-sm' : 'bg-transparent text-ink-soft hover:text-ink'"
            @click="loopTab = 'saved'"
          >Guardados</button>
        </div>

        <div v-show="loopTab === 'markers'" class="space-y-3">
          <label class="flex items-center gap-3 text-sm text-ink font-medium">
            Desde
            <select
              class="flex-1 h-10 text-sm border border-border rounded-xl bg-surface px-3 focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
              v-model="localFrom"
            >
              <option value="">—</option>
              <option v-for="m in markers" :key="m.id" :value="m.id">
                {{ m.label }} ({{ formatMarkerTime(m.time) }})
              </option>
            </select>
          </label>
          <label class="flex items-center gap-3 text-sm text-ink font-medium">
            Hasta
            <select
              class="flex-1 h-10 text-sm border border-border rounded-xl bg-surface px-3 focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
              v-model="localTo"
            >
              <option value="">—</option>
              <option v-for="m in markers" :key="m.id" :value="m.id">
                {{ m.label }} ({{ formatMarkerTime(m.time) }})
              </option>
            </select>
          </label>

          <button
            class="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl transition-colors cursor-pointer border-none text-left mt-2"
            :class="!loopEnabled ? 'bg-accent-subtle' : 'hover:bg-surface'"
            @click="selectLoop(null)"
          >
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              :class="!loopEnabled ? 'border-accent' : 'border-border'">
              <div v-if="!loopEnabled" class="w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            <span class="text-sm font-medium">Sin bucle</span>
          </button>
        </div>

        <div v-show="loopTab === 'saved'" class="space-y-1">
          <button
            class="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl transition-colors cursor-pointer border-none text-left"
            :class="!loopEnabled ? 'bg-accent-subtle' : 'hover:bg-surface'"
            @click="selectLoop(null)"
          >
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              :class="!loopEnabled ? 'border-accent' : 'border-border'">
              <div v-if="!loopEnabled" class="w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            <span class="text-sm font-medium">Sin bucle</span>
          </button>

          <button
            v-for="loop in validLoops"
            :key="loop.id"
            class="w-full flex items-center gap-3 py-2.5 px-4 rounded-xl transition-colors cursor-pointer border-none text-left"
            :class="isActiveLoop(loop) ? 'bg-accent-subtle' : 'hover:bg-surface'"
            @click="selectLoop(loop)"
          >
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              :class="isActiveLoop(loop) ? 'border-accent' : 'border-border'">
              <div v-if="isActiveLoop(loop)" class="w-2.5 h-2.5 rounded-full bg-accent" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-sm font-medium">{{ loop.name }}</span>
              <span class="text-xs text-ink-subtle ml-2">{{ resolveLoopRange(loop) }}</span>
            </div>
          </button>
        </div>
      </AppBottomSheet>
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
import AppBottomSheet from '../components/AppBottomSheet.vue'
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
const showLoopSheet = ref(false)
const loopEnabled = ref(false)
const localFrom = ref('')
const localTo = ref('')
const loopTab = ref('markers')

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
    loopEnabled.value = newSong.loopEnabled ?? false
    localFrom.value = newSong.activeFrom ?? ''
    localTo.value = newSong.activeTo ?? ''
  }
}, { immediate: true })

watch(localFrom, (id) => {
  if (!song.value || song.value.activeFrom === id) return
  if (!id && !localTo.value) {
    store.update(song.value.id, { activeFrom: '', loopEnabled: false })
  } else {
    store.update(song.value.id, { activeFrom: id, loopEnabled: true })
  }
})

watch(localTo, (id) => {
  if (!song.value || song.value.activeTo === id) return
  if (!id && !localFrom.value) {
    store.update(song.value.id, { activeTo: '', loopEnabled: false })
  } else {
    store.update(song.value.id, { activeTo: id, loopEnabled: true })
  }
})

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

const markers = computed(() => song.value?.markers ?? [])

const activeLoopRange = computed(() => {
  if (!loopEnabled.value || !song.value?.markers || !song.value?.activeFrom || !song.value?.activeTo) return null
  const from = song.value.markers.find((m) => m.id === song.value.activeFrom)
  const to = song.value.markers.find((m) => m.id === song.value.activeTo)
  if (!from || !to || from.time >= to.time) return null
  return { from: from.time, to: to.time }
})

const validLoops = computed(() => {
  if (!song.value?.loops || !song.value?.markers) return []
  return song.value.loops.filter((l) => {
    const from = song.value.markers.find((m) => m.id === l.from)
    const to = song.value.markers.find((m) => m.id === l.to)
    return from && to && from.time < to.time
  })
})

function isActiveLoop(loop) {
  return loopEnabled.value && song.value?.activeFrom === loop.from && song.value?.activeTo === loop.to
}

function resolveLoopRange(loop) {
  if (!song.value?.markers) return ''
  const from = song.value.markers.find((m) => m.id === loop.from)
  const to = song.value.markers.find((m) => m.id === loop.to)
  if (!from || !to) return ''
  const fmt = (t) => {
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }
  return `${fmt(from.time)} → ${fmt(to.time)}`
}

function formatMarkerTime(t) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function selectLoop(loop) {
  showLoopSheet.value = false
  if (!loop) {
    loopEnabled.value = false
    store.update(song.value.id, { loopEnabled: false })
    return
  }
  loopEnabled.value = true
  store.update(song.value.id, { activeFrom: loop.from, activeTo: loop.to, loopEnabled: true })
}

onMounted(() => {
  if (!store.loaded) store.load()
})
</script>
