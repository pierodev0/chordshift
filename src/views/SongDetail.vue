<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader title="Canción" @back="router.push({ name: 'home' })">
      <template #actions>
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
      <div class="flex-1 overflow-y-auto px-4 pb-24">
        <div class="pt-4 pb-1">
          <h1 class="text-2xl font-bold text-ink leading-tight">{{ song.title }}</h1>
          <p v-if="song.artist" class="text-ink-soft text-sm mt-0.5">{{ song.artist }}</p>
        </div>

        <div class="pb-2">
          <ChordLegend :chords="chords" />
        </div>

        <div class="font-mono text-sm leading-relaxed whitespace-pre-wrap" v-html="renderedHtml" />
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

      <TransposeSheet
        :show="showSheet"
        :keyText="keyText"
        @close="showSheet = false"
        @transpose="changeTranspose"
      />
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
import AppPageHeader from '../components/AppPageHeader.vue'
import AppIconButton from '../components/AppIconButton.vue'
import ChordLegend from '../components/ChordLegend.vue'
import TransposeSheet from '../components/TransposeSheet.vue'

const { chordRegex, isChordLine, transposeNote, escapeHTML } = useChordTransposer()

const route = useRoute()
const router = useRouter()
const store = useSongsStore()

const showSheet = ref(false)
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
