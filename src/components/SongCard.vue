<template>
  <div
    class="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer active:scale-[0.98]"
    @click="goToSong"
  >
    <div :class="coverColor" class="h-14 flex items-center justify-center">
      <span class="text-2xl font-bold text-white/90 select-none">{{
        initial
      }}</span>
    </div>
    <div class="p-3.5">
      <h3 class="font-semibold text-ink text-sm truncate">
        {{ song.title }}
      </h3>
      <p v-if="song.artist" class="text-ink-soft text-xs mt-0.5">
        {{ song.artist }}
      </p>
      <div class="flex items-center gap-1.5 mt-1.5">
        <span
          v-if="song.capo"
          class="text-[10px] font-bold text-accent bg-accent-subtle px-1.5 py-0.5 rounded shrink-0"
          >{{ formatCapo(song.capo) }}</span
        >
        <span
          class="text-ink-subtle text-xs font-mono truncate leading-relaxed flex-1 min-w-0"
          >{{ preview }}</span
        >
        <span
          v-if="(song.difficulty || 0) > 0"
          class="inline-flex items-center gap-0.5 text-[10px] font-bold tabular-nums text-accent bg-accent-subtle px-1.5 py-0.5 rounded-full shrink-0"
          :title="'Dificultad ' + song.difficulty + ' de 10'"
          aria-label="Dificultad"
          data-testid="difficulty-badge"
        >
          {{ song.difficulty }}<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
          </svg></span
        >
        <span
          class="inline-flex items-center gap-1 text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded-full shrink-0"
          :class="(song.playCount || 0) > 0 ? 'text-accent bg-accent-subtle' : 'text-ink-subtle bg-paper-2'"
          :title="playCountLabel"
          aria-label="Veces tocada"
          data-testid="play-count-badge"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          {{ song.playCount || 0 }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

function formatCapo(val) {
  return /^\d+$/.test(val) ? 'Capo ' + val : val
}

const props = defineProps({ song: { type: Object, required: true }, playlistId: { type: String, default: '' }, from: { type: String, default: '' } })
const router = useRouter()
const route = useRoute()

function goToSong() {
  const to = { name: 'song-detail', params: { id: props.song.id } }
  const query = {}
  if (props.playlistId) query.playlistId = props.playlistId
  query.from = props.from || route.name || 'songs'
  to.query = query
  router.push(to)
}

const initial = computed(() => (props.song.title || '?')[0].toUpperCase())

const coverColor = computed(() => {
  const c = initial.value
  if (c <= 'B') return 'bg-cover-1'
  if (c <= 'D') return 'bg-cover-2'
  if (c <= 'L') return 'bg-cover-3'
  return 'bg-cover-4'
})

const preview = computed(() => {
  const firstLine = props.song.content
    .split('\n')
    .find((l) => l.trim().length > 5)
  return firstLine ? firstLine.trim().slice(0, 60) : 'Sin contenido'
})

const playCountLabel = computed(() => {
  const count = props.song.playCount || 0
  return count === 1 ? '1 tocada' : count + ' tocadas'
})
</script>
