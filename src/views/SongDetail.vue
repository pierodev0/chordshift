<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center gap-3 px-4 py-3.5 bg-white/80 backdrop-blur-sm border-b border-border shrink-0">
      <button
        class="w-9 h-9 rounded-xl hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center -ml-1"
        @click="router.push({ name: 'home' })"
        aria-label="Volver"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="text-ink">
          <path d="M19 12H5m7 7-7-7 7-7" />
        </svg>
      </button>
      <span class="text-sm font-semibold text-ink flex-1">Canción</span>
      <button
        v-if="song"
        class="w-9 h-9 rounded-xl hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none flex items-center justify-center"
        @click="router.push({ name: 'song-edit', params: { id: song.id } })"
        aria-label="Editar"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink-soft">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </button>
    </header>

    <template v-if="song">
      <div :class="coverColor" class="px-4 py-6 flex flex-col items-center text-center -mt-px">
        <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <span class="text-3xl font-bold text-white/90">{{ initial }}</span>
        </div>
        <h1 class="text-xl font-bold text-white leading-tight">{{ song.title }}</h1>
        <p v-if="song.artist" class="text-white/70 text-sm mt-1">{{ song.artist }}</p>
      </div>

      <div class="px-4 -mt-3 relative z-10">
        <TransposeBar :keyText @transpose="changeTranspose" />
      </div>

      <div class="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <div class="font-mono text-sm leading-relaxed whitespace-pre-wrap" v-html="renderedHtml" />
      </div>

      <div class="px-4 pb-4 shrink-0">
        <ChordLegend :chords="chords" />
      </div>
    </template>

    <div v-else class="flex-1 flex items-center justify-center text-ink-soft text-sm">
      Canción no encontrada
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { useChordTransposer } from '../composables/useChordTransposer'
import TransposeBar from '../components/TransposeBar.vue'
import ChordLegend from '../components/ChordLegend.vue'

const { chordRegex, isChordLine, transposeNote, escapeHTML } = useChordTransposer()

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const currentStep = ref(0)

const song = computed(() => store.getById(route.params.id))

const initial = computed(() => (song.value?.title || '?')[0].toUpperCase())

const coverColor = computed(() => {
  const c = initial.value
  if (c <= 'B') return 'bg-cover-1'
  if (c <= 'D') return 'bg-cover-2'
  if (c <= 'L') return 'bg-cover-3'
  return 'bg-cover-4'
})

const keyText = computed(() =>
  currentStep.value === 0
    ? 'Tono Original'
    : (currentStep.value > 0 ? '+' : '') + currentStep.value + ' Semitonos',
)

const renderedHtml = computed(() => {
  if (!song.value) return ''
  const lines = song.value.content.split('\n')
  const rendered = lines.map((line) => {
    if (isChordLine(line)) {
      return line.replace(chordRegex, (match, root, bass) => {
        const transRoot = transposeNote(root, currentStep.value)
        const transBass = bass ? '/' + transposeNote(bass, currentStep.value) : ''
        return `<strong>${transRoot}${transBass}</strong>`
      })
    }
    return escapeHTML(line)
  })
  return rendered.join('\n')
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

onMounted(() => {
  if (!store.loaded) store.load()
})
</script>
