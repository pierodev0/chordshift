<template>
  <div v-if="audioUrl" class="bg-white border-b border-border shrink-0">
    <div class="flex items-center gap-2.5 px-4 pt-2.5">
      <div
        class="flex-1 h-1.5 rounded-full bg-border cursor-pointer relative overflow-hidden"
        @click="seek"
      >
        <div class="h-full rounded-full bg-accent transition-[width] duration-200" :style="{ width: progress + '%' }" />
      </div>
      <span class="text-[11px] text-ink-soft font-mono tabular-nums w-[80px] text-right shrink-0">
        {{ displayTime }}
      </span>
    </div>

    <div class="flex items-center justify-center gap-1 px-4 py-1.5">
      <div class="flex items-center gap-1">
        <button
          v-if="loopRange"
          class="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer shrink-0 text-accent bg-accent-subtle"
          disabled
          aria-label="Bucle activo"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
        <button
          v-if="showLab"
          class="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors shrink-0 text-ink-subtle hover:text-accent hover:bg-accent-subtle"
          @click="$emit('openLab')"
          aria-label="Audio Lab"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M3 14s1.5-2 4-2 4 2 4 2 1.5-2 4-2 4 2 4 2" />
            <path d="M3 10s1.5-2 4-2 4 2 4 2 1.5-2 4-2 4 2 4 2" />
            <path d="M3 6s1.5-2 4-2 4 2 4 2 1.5-2 4-2 4 2 4 2" />
            <line x1="12" y1="18" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors shrink-0 text-ink-subtle hover:text-accent hover:bg-accent-subtle disabled:opacity-30 disabled:cursor-default"
          :disabled="!showPrev"
          @click="$emit('prev')"
          aria-label="Anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="19 20 9 12 19 4" />
            <rect x="5" y="4" width="2" height="16" rx="1" />
          </svg>
        </button>
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
        <button
          class="w-9 h-9 rounded-full flex items-center justify-center border-none cursor-pointer transition-colors shrink-0 text-ink-subtle hover:text-accent hover:bg-accent-subtle disabled:opacity-30 disabled:cursor-default"
          :disabled="!showNext"
          @click="$emit('next')"
          aria-label="Siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 20 15 12 5 4" />
            <rect x="17" y="4" width="2" height="16" rx="1" />
          </svg>
        </button>
      </div>

      <div class="flex items-center gap-1">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
          :class="playbackRate !== 1 ? 'text-accent bg-accent-subtle' : 'text-ink-subtle hover:bg-surface'"
          @click="showSpeedSheet = true"
          aria-label="Velocidad"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
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
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer transition-colors shrink-0 gap-[2px]"
          :class="autoScrolling && scrollDelay !== 'auto' ? 'text-accent bg-accent-subtle' : 'text-ink-subtle hover:bg-surface'"
          @click="$emit('openDelaySheet')"
          aria-label="Delay de scroll"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span class="text-[9px] font-bold">{{ delayLabel }}</span>
        </button>
      </div>
    </div>

    <audio ref="audioEl" :src="audioUrl" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" @ended="onEnded" />
  </div>

  <SpeedSheet
    :show="showSpeedSheet"
    :value="playbackRate"
    @close="showSpeedSheet = false"
    @change="playbackRate = $event"
  />
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import SpeedSheet from './SpeedSheet.vue'

const props = defineProps({
  audioUrl: String,
  totalLines: { type: Number, default: 0 },
  autoScrolling: Boolean,
  showLab: Boolean,
  loopRange: { type: Object, default: null }, // { from: number, to: number } | null
  scrollDelay: { type: [Number, String], default: 'auto' },
  showPrev: Boolean,
  showNext: Boolean,
})
const emit = defineEmits(['toggleAutoScroll', 'loaded', 'openLab', 'openDelaySheet', 'ended', 'prev', 'next'])

const audioEl = ref(null)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const playbackRate = ref(1)
const showSpeedSheet = ref(false)
let lastScrolledLine = -1
const autoDelayValue = ref(0)

const delayLabel = computed(() => {
  const d = props.scrollDelay
  if (d === 'auto') {
    const ae = autoDelayValue.value
    return ae > 0 ? `Auto(${ae}s)` : 'Auto'
  }
  return Number(d) + 's'
})

const displayTime = computed(() => {
  const rate = playbackRate.value
  const effCurrent = rate > 0 ? currentTime.value / rate : 0
  const effDuration = rate > 0 ? duration.value / rate : 0
  return formatTime(effCurrent) + ' / ' + formatTime(effDuration)
})

function togglePlay() {
  if (!audioEl.value) return
  if (playing.value) {
    audioEl.value.pause()
  } else {
    if (props.loopRange) {
      audioEl.value.currentTime = props.loopRange.from
    }
    audioEl.value.play()
  }
  playing.value = !playing.value
}

function onTimeUpdate() {
  if (!audioEl.value) return
  const t = audioEl.value.currentTime
  currentTime.value = t
  progress.value = duration.value ? (t / duration.value) * 100 : 0

  if (props.loopRange && t >= props.loopRange.to) {
    audioEl.value.currentTime = props.loopRange.from
    return
  }

  if (props.autoScrolling && props.totalLines > 0 && duration.value > 0) {
    let effectiveDelay = 0
    if (props.scrollDelay === 'auto') {
      const container = document.querySelector('.overflow-y-auto')
      const firstLine = document.getElementById('line-0')
      if (container && firstLine) {
        const lineHeight = firstLine.offsetHeight
        const visibleLines = Math.ceil(container.clientHeight / lineHeight)
        const secondsPerLine = duration.value / props.totalLines
        effectiveDelay = Math.round((visibleLines / 3) * secondsPerLine)
        autoDelayValue.value = effectiveDelay
      }
    } else {
      effectiveDelay = Number(props.scrollDelay) || 0
    }
    const scrollTime = Math.max(0, t - effectiveDelay)
    const idx = Math.min(Math.floor((scrollTime / duration.value) * props.totalLines), props.totalLines - 1)
    if (idx !== lastScrolledLine) {
      const el = document.getElementById(`line-${idx}`)
      if (el) {
        el.scrollIntoView({ block: 'start' })
        lastScrolledLine = idx
      }
    }
  }
}

function onLoaded() {
  if (!audioEl.value) return
  duration.value = audioEl.value.duration || 0
  audioEl.value.playbackRate = playbackRate.value
  audioEl.value.preservesPitch = true
  emit('loaded', audioEl.value.duration)
}

function onEnded() {
  playing.value = false
  emit('ended')
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

watch(playbackRate, (rate) => {
  if (audioEl.value) {
    audioEl.value.playbackRate = rate
    audioEl.value.preservesPitch = true
  }
})

watch(() => props.audioUrl, () => {
  playing.value = false
  currentTime.value = 0
  duration.value = 0
  progress.value = 0
  playbackRate.value = 1
  lastScrolledLine = -1
})

onBeforeUnmount(() => {
  if (audioEl.value) {
    audioEl.value.pause()
    audioEl.value.src = ''
  }
})
</script>
