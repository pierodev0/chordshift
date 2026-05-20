<template>
  <div class="h-dvh flex flex-col bg-paper">
    <AppPageHeader :title="song?.title || 'Audio Lab'" @back="saveAndGoBack">
      <template #actions>
        <span class="text-[11px] text-ink-soft font-semibold tracking-widest uppercase">{{ formatTime(duration) }}</span>
      </template>
    </AppPageHeader>

    <div class="shrink-0 relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center text-ink-soft text-sm z-10 bg-paper">
        Cargando audio...
      </div>
      <div ref="waveformRef" class="h-full" :class="{ 'invisible': loading }" />
    </div>

    <div v-if="!loading" class="flex items-center gap-2 px-4 py-2 bg-white border-t border-border shrink-0">
        <button
          class="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center border-none cursor-pointer hover:bg-accent-hover transition-colors shrink-0 active:scale-90"
          @click="togglePlay"
          :aria-label="playing ? 'Pausar' : 'Reproducir'"
        >
          <svg v-if="!playing" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        </button>

        <span class="text-[11px] text-ink-soft font-mono tabular-nums shrink-0">{{ formatTime(currentTime) }}</span>

        <div class="flex items-center gap-0.5 ml-1">
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer text-ink-subtle hover:text-ink hover:bg-surface transition-colors text-sm font-semibold"
            @click="zoomOut"
            aria-label="Alejar"
          >−</button>
          <span class="text-[10px] text-ink-subtle font-mono tabular-nums w-7 text-center">{{ currentZoom }}</span>
          <button
            class="w-7 h-7 rounded-lg flex items-center justify-center border-none cursor-pointer text-ink-subtle hover:text-ink hover:bg-surface transition-colors text-sm font-semibold"
            @click="zoomIn"
            aria-label="Acercar"
          >+</button>
        </div>

        <div class="flex-1" />

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
      </div>

      <div v-if="!loading" class="border-t border-border bg-white flex-1 overflow-y-auto min-h-0">
        <div class="px-4 py-3">
          <div class="flex items-center justify-between mb-2">
            <p class="text-[11px] font-bold text-ink-soft tracking-widest uppercase">Marcadores</p>
            <button
              class="text-[11px] font-semibold text-accent hover:text-accent-hover cursor-pointer bg-transparent border-none"
              @click="addMarkerAtCurrent"
            >
              + Add marker
            </button>
          </div>

          <div v-if="markers.length === 0" class="text-xs text-ink-subtle py-2">
            Todavía no hay marcadores. Reproducí el audio y presioná "+ Add marker".
          </div>

          <div
            v-for="m in markers"
            :key="m.id"
            class="flex items-center gap-2 py-1.5 border-b border-border-light last:border-none"
          >
            <span
              class="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0"
              :class="activeFrom === m.id || activeTo === m.id ? 'bg-accent text-white' : 'bg-accent-subtle text-accent'"
            >
              {{ m.label }}
            </span>

            <span
              class="text-xs font-mono tabular-nums text-ink w-24 cursor-pointer"
              @click="editingMarkerId = m.id"
            >{{ formatTime(m.time) }}</span>

            <button
              class="text-xs text-accent hover:text-accent-hover cursor-pointer bg-transparent border-none font-semibold"
              @click="seekToMarker(m)"
            >
              ▶ Ir
            </button>

            <button
              class="w-5 h-5 rounded flex items-center justify-center text-ink-subtle hover:text-accent hover:bg-accent-subtle cursor-pointer bg-transparent border-none"
              @click="editingMarkerId = m.id"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </button>

            <div class="flex-1" />
            <button
              class="w-5 h-5 rounded flex items-center justify-center text-ink-subtle hover:text-red-500 hover:bg-red-50 cursor-pointer bg-transparent border-none text-sm"
              @click="removeMarker(m.id)"
            >
              ×
            </button>
          </div>
        </div>

        <div class="px-4 py-3 border-t border-border">
          <p class="text-[11px] font-bold text-ink-soft tracking-widest uppercase mb-2">Loop</p>

          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs text-ink-soft shrink-0">Desde</span>
            <select
              v-model="activeFrom"
              class="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-ink flex-1 min-w-0"
            >
              <option value="">—</option>
              <option v-for="m in markers" :key="m.id" :value="m.id">{{ m.label }} ({{ formatTime(m.time) }})</option>
            </select>

            <span class="text-xs text-ink-soft shrink-0">Hasta</span>
            <select
              v-model="activeTo"
              class="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-ink flex-1 min-w-0"
            >
              <option value="">—</option>
              <option v-for="m in markers" :key="m.id" :value="m.id">{{ m.label }} ({{ formatTime(m.time) }})</option>
            </select>
          </div>

          <div class="flex items-center gap-2 mb-3">
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
              :class="loopEnabled ? 'bg-accent text-white border-accent' : 'bg-white text-ink border-border hover:bg-surface'"
              @click="loopEnabled = !loopEnabled"
            >
              🔁 Loop {{ loopEnabled ? 'ON' : 'OFF' }}
            </button>
            <button
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
              :class="snapEnabled ? 'bg-accent text-white border-accent' : 'bg-white text-ink border-border hover:bg-surface'"
              @click="snapEnabled = !snapEnabled"
            >
              🎯 Snap {{ snapEnabled ? 'ON' : 'OFF' }}
            </button>
          </div>

          <div class="flex items-center gap-1.5 flex-wrap">
            <button
              v-for="loop in loops"
              :key="loop.id"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer"
              :class="isActiveLoop(loop) ? 'bg-accent text-white border-accent' : 'bg-white text-ink border-border hover:bg-surface'"
              @click="loadLoop(loop)"
            >
              {{ loop.name }}
            </button>
            <button
              v-if="activeLoop"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-accent border border-accent/30 hover:bg-accent-subtle cursor-pointer"
              @click="saveCurrentLoop"
            >
              + Guardar
            </button>
          </div>
        </div>

        <div v-if="bpm" class="px-4 py-2.5 border-t border-border">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-bold text-ink-soft tracking-widest uppercase shrink-0">BPM</span>
            <span class="text-sm font-bold text-ink tabular-nums">{{ bpm }}</span>
            <div class="flex gap-0.5 ml-2 overflow-hidden">
              <div
                v-for="(bt, i) in displayedBeats"
                :key="i"
                class="w-1.5 h-3 rounded-full transition-colors"
                :class="beatTimes.indexOf(bt) % 4 === 0 ? 'bg-accent' : 'bg-border'"
              />
            </div>
          </div>
        </div>
      </div>

    <AppBottomSheet :show="!!editingMarkerId" @close="editingMarkerId = ''">
      <template #title>
        <p class="text-center text-xs font-bold text-ink-soft tracking-widest uppercase mb-6">
          Editar marcador {{ editingMarker?.label }}
        </p>
      </template>

      <div class="flex justify-center items-center gap-3 font-mono mb-6">
        <div class="flex flex-col items-center gap-1">
          <button
            class="w-12 h-7 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface border-none cursor-pointer text-sm transition-colors"
            @click="adjustMarkerTime(editingMarkerId, 'm', 1)"
          >▲</button>
          <input
            type="number" min="0"
            :value="timeToParts(editingMarker?.time || 0).m"
            @input="updateMarkerPart(editingMarkerId, 'm', $event)"
            @wheel.prevent="adjustMarkerTime(editingMarkerId, 'm', $event.deltaY > 0 ? -1 : 1)"
            class="w-16 h-10 text-lg text-center border border-border rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-accent tabular-nums appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            class="w-12 h-7 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface border-none cursor-pointer text-sm transition-colors"
            @click="adjustMarkerTime(editingMarkerId, 'm', -1)"
          >▼</button>
          <span class="text-[10px] text-ink-subtle mt-0.5">min</span>
        </div>

        <span class="text-lg text-ink-subtle font-bold -mt-6">:</span>

        <div class="flex flex-col items-center gap-1">
          <button
            class="w-12 h-7 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface border-none cursor-pointer text-sm transition-colors"
            @click="adjustMarkerTime(editingMarkerId, 's', 1)"
          >▲</button>
          <input
            type="number" min="0" max="59"
            :value="timeToParts(editingMarker?.time || 0).s"
            @input="updateMarkerPart(editingMarkerId, 's', $event)"
            @wheel.prevent="adjustMarkerTime(editingMarkerId, 's', $event.deltaY > 0 ? -1 : 1)"
            class="w-16 h-10 text-lg text-center border border-border rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-accent tabular-nums appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            class="w-12 h-7 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface border-none cursor-pointer text-sm transition-colors"
            @click="adjustMarkerTime(editingMarkerId, 's', -1)"
          >▼</button>
          <span class="text-[10px] text-ink-subtle mt-0.5">seg</span>
        </div>

        <span class="text-lg text-ink-subtle font-bold -mt-6">.</span>

        <div class="flex flex-col items-center gap-1">
          <button
            class="w-12 h-7 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface border-none cursor-pointer text-sm transition-colors"
            @click="adjustMarkerTime(editingMarkerId, 'ms', 10)"
          >▲</button>
          <input
            type="number" min="0" max="999"
            :value="timeToParts(editingMarker?.time || 0).ms"
            @input="updateMarkerPart(editingMarkerId, 'ms', $event)"
            @wheel.prevent="adjustMarkerTime(editingMarkerId, 'ms', $event.deltaY > 0 ? -10 : 10)"
            class="w-16 h-10 text-lg text-center border border-border rounded-xl bg-surface focus:outline-none focus:ring-1 focus:ring-accent tabular-nums appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button
            class="w-12 h-7 rounded-lg flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface border-none cursor-pointer text-sm transition-colors"
            @click="adjustMarkerTime(editingMarkerId, 'ms', -10)"
          >▼</button>
          <span class="text-[10px] text-ink-subtle mt-0.5">ms</span>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border bg-white text-ink hover:bg-surface transition-colors cursor-pointer"
          @click="seekToMarker(editingMarker)"
        >
          ▶ Ir
        </button>
        <button
          class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-accent text-white border-none hover:bg-accent-hover transition-colors cursor-pointer"
          @click="editingMarkerId = ''"
        >
          ✓ Listo
        </button>
      </div>
    </AppBottomSheet>

    <SpeedSheet
      :show="showSpeedSheet"
      :value="playbackRate"
      @close="showSpeedSheet = false"
      @change="changePlaybackRate"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSongsStore } from '../stores/songsStore'
import { useAudioCache } from '../composables/useAudioCache'
import { useBeatDetection } from '../composables/useBeatDetection'
import { useAudioLooper } from '../composables/useAudioLooper'
import AppPageHeader from '../components/AppPageHeader.vue'
import AppBottomSheet from '../components/AppBottomSheet.vue'
import SpeedSheet from '../components/SpeedSheet.vue'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import { Time } from 'tone'

const route = useRoute()
const router = useRouter()
const store = useSongsStore()
const { loadAudioBlob, loadAudioBuffer } = useAudioCache()
const { bpm, beatTimes, detected, detecting, detect, snapToBeat } = useBeatDetection()
const audioLooper = useAudioLooper()
const {
  markers, loops, loopEnabled, snapEnabled, activeFrom, activeTo, activeLoop,
  addMarker, removeMarker, updateMarkerTime, setActiveFrom, setActiveTo, saveLoop,
  snapToBeatFn,
} = audioLooper

const song = computed(() => store.getById(route.params.id))

const loading = ref(true)
const waveformRef = ref(null)
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const playbackRate = ref(1)
const showSpeedSheet = ref(false)
const currentZoom = ref(50)
const editingMarkerId = ref('')

const editingMarker = computed(() => markers.value.find((m) => m.id === editingMarkerId.value) || null)

const ZOOM_MIN = 10           // min px/sec — waveform comprimido
const ZOOM_MAX = 200           // max px/sec — waveform expandido
const FOLLOW_ANCHOR = 0.33     // cursor se mantiene al 33% del viewport durante playback

let ws = null
let scrollContainer = null
let regionsPlugin = null
let markerRegions = new Map()
let loopWsRegion = null
let wsReady = false
let suppressRegionCreate = false
let restoring = false

const displayedBeats = computed(() => beatTimes.value.slice(0, 40))

function formatTime(t) {
  if (!t || isNaN(t)) return '0:00.000'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const ms = Math.floor((t % 1) * 1000)
  return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`
}

function timeToParts(t) {
  if (!t || isNaN(t)) return { m: 0, s: 0, ms: 0 }
  const ms = Math.round(new Time(t).toSeconds() * 1000)
  return {
    m: Math.floor(ms / 60000),
    s: Math.floor((ms % 60000) / 1000),
    ms: ms % 1000,
  }
}

function updateMarkerPart(id, part, e) {
  const val = parseInt(e.target.value, 10) || 0
  const p = timeToParts(markers.value.find((m) => m.id === id)?.time)
  const ms = (part === 'm' ? val * 60000 : p.m * 60000)
           + (part === 's' ? val * 1000 : p.s * 1000)
           + (part === 'ms' ? val : p.ms)
  updateMarkerTime(id, Math.max(0, ms / 1000))
  updateMarkerRegions()
  autoSave()
}

function adjustMarkerTime(id, part, delta) {
  const m = markers.value.find((m) => m.id === id)
  if (!m) return
  const p = timeToParts(m.time)
  const ms = p.m * 60000 + p.s * 1000 + p.ms
  const addMs = { m: delta * 60000, s: delta * 1000, ms: delta }[part]
  updateMarkerTime(id, Math.max(0, (ms + addMs) / 1000))
  updateMarkerRegions()
  autoSave()
}

// Necesitamos un ref aparte del zoom de wavesurfer para re-sincronizar el scroll follow
function applyZoom(val) {
  currentZoom.value = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, val))
  if (ws) ws.zoom(currentZoom.value)
}

function zoomIn() { applyZoom(currentZoom.value + 15) }
function zoomOut() { applyZoom(currentZoom.value - 15) }

function togglePlay() {
  if (!ws) return
  const loop = activeLoop.value
  if (loop && playing.value === false) {
    const t = ws.getCurrentTime()
    if (t < loop.from || t > loop.to) {
      ws.setTime(loop.from)
    }
  }
  ws.playPause()
}

function changePlaybackRate(rate) {
  playbackRate.value = rate
  if (ws) ws.setPlaybackRate(rate, true)
}

function seekToMarker(m) {
  if (!ws) return
  ws.setTime(m.time)
}

function addMarkerAtCurrent() {
  const t = currentTime.value
  const snapFn = snapEnabled.value ? snapToBeat : null
  const time = snapFn ? snapFn(t) : t
  addMarker(time)
  syncMarkerRegions()
  autoSave()
}

function removeMarkerAndSync(id) {
  removeMarker(id)
  syncMarkerRegions()
  autoSave()
}

function isActiveLoop(loop) {
  return activeFrom.value === loop.from && activeTo.value === loop.to
}

function loadLoop(loop) {
  setActiveFrom(loop.from)
  setActiveTo(loop.to)
  loopEnabled.value = true
  updateLoopRegion()
  if (ws) {
    const fromM = markers.value.find((m) => m.id === loop.from)
    if (fromM) ws.setTime(fromM.time)
  }
}

function saveCurrentLoop() {
  const name = prompt('Nombre del loop:')
  if (!name) return
  saveLoop(name)
  autoSave()
}

function syncMarkerRegions() {
  if (!regionsPlugin || !wsReady) return

  const existing = new Set()
  suppressRegionCreate = true
  for (const m of markers.value) {
    existing.add(m.id)
    if (markerRegions.has(m.id)) {
      markerRegions.get(m.id).setOptions({ start: m.time })
    } else {
      const r = regionsPlugin.addRegion({
        start: m.time,
        content: m.label,
        color: 'rgba(234, 88, 12, 0.15)',
        drag: false,
        resize: false,
      })
      markerRegions.set(m.id, r)
    }
  }
  suppressRegionCreate = false

  for (const [id, region] of markerRegions) {
    if (!existing.has(id)) {
      region.remove()
      markerRegions.delete(id)
    }
  }

  updateLoopRegion()
}

function updateLoopRegion() {
  if (!regionsPlugin || !wsReady) return

  if (loopWsRegion) {
    loopWsRegion.remove()
    loopWsRegion = null
  }

  const loop = activeLoop.value
  if (!loop || !loopEnabled.value) return

  suppressRegionCreate = true
  loopWsRegion = regionsPlugin.addRegion({
    start: loop.from,
    end: loop.to,
    color: 'rgba(234, 88, 12, 0.12)',
    drag: true,
    resize: true,
    minLength: 0.1,
  })
  suppressRegionCreate = false

  loopWsRegion.on('region-updated', (r) => {
    const fromMarker = markers.value.find((m) => m.id === activeFrom.value)
    const toMarker = markers.value.find((m) => m.id === activeTo.value)
    if (fromMarker) fromMarker.time = r.start
    if (toMarker) toMarker.time = r.end
    updateMarkerRegions()
    autoSave()
  })
}

function updateMarkerRegions() {
  for (const m of markers.value) {
    const r = markerRegions.get(m.id)
    if (r) r.setOptions({ start: m.time, content: m.label })
  }
}

function autoSave() {
  if (!song.value) return
  store.update(song.value.id, {
    markers: JSON.parse(JSON.stringify(markers.value)),
    loops: JSON.parse(JSON.stringify(loops.value)),
    activeFrom: activeFrom.value,
    activeTo: activeTo.value,
    loopEnabled: loopEnabled.value,
  })
}

function saveAndGoBack() {
  autoSave()
  router.push({ name: 'song-detail', params: { id: route.params.id } })
}

watch(activeFrom, () => { if (!restoring) { updateLoopRegion(); autoSave() } })
watch(activeTo, () => { if (!restoring) { updateLoopRegion(); autoSave() } })
watch(loopEnabled, () => { if (!restoring) { updateLoopRegion(); autoSave() } })

watch(snapEnabled, (val) => {
  if (val && snapToBeat) {
    snapToBeatFn.value = snapToBeat
  } else {
    snapToBeatFn.value = null
  }
})

watch(activeLoop, (loop) => {
  if (loop && loopEnabled.value && ws) {
    ws.setPlaybackRate(playbackRate.value, true)
  }
})

// Al hacer zoom, el scrollWidth cambia y el scrollLeft se desfasa — hay que re-sincronizar
watch(currentZoom, () => {
  if (scrollContainer && playing.value && duration.value > 0) {
    const t = ws?.getCurrentTime() || 0
    const ratio = t / duration.value
    const cursorPx = ratio * scrollContainer.scrollWidth
    const anchorPx = scrollContainer.clientWidth * FOLLOW_ANCHOR
    const target = cursorPx - anchorPx
    if (target > 0) scrollContainer.scrollLeft = target
  }
})

onMounted(async () => {
  if (!store.loaded) store.load()
  if (!song.value?.audioKey) {
    loading.value = false
    return
  }

  const [blob, audioBuffer] = await Promise.all([
    loadAudioBlob(song.value.id),
    loadAudioBuffer(song.value.id),
  ])

  if (!blob) {
    loading.value = false
    return
  }

  if (song.value.markers?.length) {
    markers.value = JSON.parse(JSON.stringify(song.value.markers))
  }
  if (song.value.loops?.length) {
    loops.value = JSON.parse(JSON.stringify(song.value.loops))
  }
  restoring = true
  if (song.value.activeFrom && markers.value.some((m) => m.id === song.value.activeFrom)) {
    activeFrom.value = song.value.activeFrom
  }
  if (song.value.activeTo && markers.value.some((m) => m.id === song.value.activeTo)) {
    activeTo.value = song.value.activeTo
  }
  if (song.value.loopEnabled) {
    loopEnabled.value = true
  }
  restoring = false
  updateLoopRegion()
  autoSave()

  if (audioBuffer && !detected.value) {
    detect(audioBuffer)
  }

  await nextTick()

  // Sin dragSelection: arrastrar sobre el waveform hace scrub (seek continuo)
  // Las regions se crean solo con los botones "Add Marker" / "Set A" / "Set B"
  regionsPlugin = RegionsPlugin.create()

  ws = WaveSurfer.create({
    container: waveformRef.value,
    waveColor: '#ddd6ce',
    progressColor: '#ea580c',
    cursorColor: '#ea580c',
    cursorWidth: 1,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    height: 120,
    normalize: true,
    plugins: [
      regionsPlugin,
      TimelinePlugin.create({
        height: 16,
        timeInterval: 5,
        primaryLabelInterval: 2,
        style: { fontSize: '10px', color: '#a8a29e' },
        formatTimeCallback: (s) => {
          const m = Math.floor(s / 60)
          const sec = Math.floor(s % 60)
          return `${m}:${sec.toString().padStart(2, '0')}`
        },
      }),
    ],
  })

  ws.on('ready', () => {
    wsReady = true
    duration.value = ws.getDuration()
    playing.value = false
    loading.value = false
    ws.setPlaybackRate(playbackRate.value, true)
    syncMarkerRegions()

    // El wrapper interno de wavesurfer es quien tiene scroll, no el container que pasamos
    scrollContainer = (() => {
      const el = waveformRef.value
      if (!el) return null
      const wrapper = el.querySelector('[class*="wrapper"]')
      if (wrapper) return wrapper
      return Array.from(el.children).find((c) => c.scrollWidth > c.clientWidth || c.tagName === 'DIV') || el
    })()

    regionsPlugin.on('region-clicked', (r, e) => {
      e.stopPropagation()
      if (loopWsRegion && r === loopWsRegion) {
        ws.play(r.start, r.end)
      }
    })
  })

  ws.on('play', () => { playing.value = true })
  ws.on('pause', () => { playing.value = false })
  ws.on('finish', () => { playing.value = false })

  // Scrub: arrastrar sobre el waveform busca (seek continuo) como Spotify/YouTube
  // Sin dragSelection en RegionsPlugin, el drag nativo de wavesurfer queda libre para esto
  ws.on('drag', (relativeX) => {
    ws.setTime(relativeX * duration.value)
  })

  ws.on('timeupdate', (t) => {
    currentTime.value = t

    // El cursor se queda fijo al 33% del viewport para que el ojo no tenga que seguirlo
    if (scrollContainer && currentZoom.value > ZOOM_MIN && duration.value > 0) {
      const ratio = t / duration.value
      const cursorPx = ratio * scrollContainer.scrollWidth
      const anchorPx = scrollContainer.clientWidth * FOLLOW_ANCHOR
      const target = cursorPx - anchorPx
      if (target > scrollContainer.scrollLeft && target > 0) {
        scrollContainer.scrollLeft = target
      }
    }

    if (loopEnabled.value && loopWsRegion && playing.value) {
      const loop = activeLoop.value
      if (loop && t >= loop.to) {
        ws.setTime(loop.from)
        ws.play()
      }
    }
  })

  ws.loadBlob(blob)

  // Zoom con scroll del mouse sobre la forma de onda
  const wheelTarget = waveformRef.value
  if (wheelTarget) {
    wheelTarget.addEventListener('wheel', (e) => {
      e.preventDefault()
      applyZoom(currentZoom.value + (e.deltaY > 0 ? -10 : 10))
    }, { passive: false })

    // Zoom con gesto de pinch (2 dedos) en dispositivos táctiles
    let pinchLastDist = 0
    wheelTarget.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        pinchLastDist = Math.hypot(dx, dy)
      }
    }, { passive: true })

    wheelTarget.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX
        const dy = e.touches[0].clientY - e.touches[1].clientY
        const dist = Math.hypot(dx, dy)
        const delta = dist - pinchLastDist
        pinchLastDist = dist
        if (Math.abs(delta) > 3) {
          applyZoom(currentZoom.value + (delta > 0 ? 8 : -8))
        }
      }
    }, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (ws) {
    ws.destroy()
    ws = null
  }
})
</script>
