<template>
  <div class="h-dvh flex flex-col bg-paper">
    <header class="flex items-center gap-3 px-4 py-3 border-b border-border bg-white shrink-0">
      <button
        class="p-1 -ml-1 rounded-lg hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        @click="router.push({ name: 'home' })"
        aria-label="Volver"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink">
          <path d="M19 12H5m7 7-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1 min-w-0">
        <h1 v-if="song" class="text-base font-semibold text-ink truncate">{{ song.title }}</h1>
      </div>
      <button
        v-if="song"
        class="p-1.5 rounded-lg hover:bg-accent-subtle transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        @click="router.push({ name: 'song-edit', params: { id: song.id } })"
        aria-label="Editar"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-ink-soft">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        </svg>
      </button>
    </header>

    <div v-if="song" class="px-4 py-3 shrink-0">
      <TransposeBar :keyText @transpose="changeTranspose" />
      <p v-if="song.artist" class="text-ink-soft text-sm mt-2 text-center">{{ song.artist }}</p>
    </div>

    <div class="flex-1 overflow-y-auto px-4 pb-6">
      <div v-if="song" class="font-mono text-sm leading-relaxed whitespace-pre-wrap" v-html="renderedHtml" />
      <div v-else class="flex items-center justify-center h-full text-ink-soft text-sm">
        Canción no encontrada
      </div>
    </div>

    <div class="px-4 pb-4 shrink-0">
      <ChordLegend :chords="chords" />
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
