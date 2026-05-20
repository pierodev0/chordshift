<template>
  <div v-if="audioUrl" class="flex items-center gap-2.5 px-4 py-2.5 bg-white border-b border-border shrink-0">
    <button
      class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center border-none cursor-pointer hover:bg-accent-hover transition-colors shrink-0 active:scale-90"
      @click="togglePlay"
      aria-label="Reproducir"
    >
      <svg v-if="!playing" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21" />
      </svg>
      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
    </button>

    <div
      class="flex-1 h-1.5 rounded-full bg-border cursor-pointer relative overflow-hidden"
      @click="seek"
    >
      <div class="h-full rounded-full bg-accent transition-[width] duration-200" :style="{ width: progress + '%' }" />
    </div>

    <span class="text-[11px] text-ink-soft font-mono tabular-nums w-[72px] text-right shrink-0">
      {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
    </span>

    <button
      class="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
      :class="autoScrolling ? 'text-accent bg-accent-subtle' : 'text-ink-subtle hover:bg-surface'"
      @click="$emit('toggleAutoScroll')"
      aria-label="Autoscroll"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    </button>

    <audio ref="audioEl" :src="audioUrl" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @ended="onEnded" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  audioUrl: String,
  totalLines: { type: Number, default: 0 },
  autoScrolling: Boolean,
})
const emit = defineEmits(['toggleAutoScroll', 'loaded'])

const audioEl = ref(null)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)

function togglePlay() {
  if (!audioEl.value) return
  if (playing.value) {
    audioEl.value.pause()
  } else {
    audioEl.value.play()
  }
  playing.value = !playing.value
}

function onTimeUpdate() {
  if (!audioEl.value) return
  const t = audioEl.value.currentTime
  currentTime.value = t
  progress.value = duration.value ? (t / duration.value) * 100 : 0

  if (props.autoScrolling && props.totalLines > 0 && duration.value > 0) {
    const idx = Math.min(Math.floor((t / duration.value) * props.totalLines), props.totalLines - 1)
    const el = document.getElementById(`line-${idx}`)
    if (el) el.scrollIntoView({ block: 'start' })
  }
}

function onLoaded() {
  if (!audioEl.value) return
  duration.value = audioEl.value.duration || 0
  emit('loaded', audioEl.value.duration)
}

function onEnded() {
  playing.value = false
}

function seek(e) {
  if (!audioEl.value || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  audioEl.value.currentTime = x * duration.value
}

function formatTime(t) {
  if (!t || isNaN(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

watch(() => props.audioUrl, () => {
  playing.value = false
  currentTime.value = 0
  duration.value = 0
  progress.value = 0
})

onBeforeUnmount(() => {
  if (audioEl.value) {
    audioEl.value.pause()
    audioEl.value.src = ''
  }
})
</script>
