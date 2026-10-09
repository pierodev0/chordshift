import { ref } from 'vue'

const MAX_PITCH_SHIFT = 12

function clampSemitones(semitones) {
  if (!Number.isFinite(semitones)) return 0
  return Math.max(-MAX_PITCH_SHIFT, Math.min(MAX_PITCH_SHIFT, Math.round(semitones)))
}

export function useAudioPitch() {
  const enabled = ref(false)
  const error = ref(null)
  let nodes = null

  function disposeNodes() {
    try {
      nodes?.pitchShift?.dispose?.()
    } catch {
      // Tone dispose is best-effort on teardown
    }
    try {
      nodes?.source?.disconnect?.()
    } catch {
      // MediaElementSource disconnect is best-effort on teardown
    }
    nodes = null
    enabled.value = false
  }

  async function ensureGraph(audioEl) {
    if (nodes?.element === audioEl && nodes?.pitchShift) return nodes
    disposeNodes()
    error.value = null
    if (!audioEl) return null

    let ToneModule
    try {
      ToneModule = await import('tone')
    } catch (err) {
      error.value = err
      return null
    }

    try {
      await ToneModule.start()
      const context = ToneModule.getContext()
      await context.rawContext.resume()
      const mediaStream = context.rawContext.createMediaElementSource(audioEl)
      const pitchShift = new ToneModule.PitchShift(0)
      pitchShift.wet.value = 0
      ToneModule.connect(mediaStream, pitchShift)
      pitchShift.toDestination()
      nodes = { element: audioEl, pitchShift, source: mediaStream }
      enabled.value = true
      return nodes
    } catch (err) {
      error.value = err
      disposeNodes()
      return null
    }
  }

  async function attach(audioEl, semitones = 0) {
    error.value = null
    const steps = clampSemitones(semitones)
    if (!audioEl) return false
    if (steps === 0) {
      if (nodes?.pitchShift) {
        nodes.pitchShift.pitch = 0
        nodes.pitchShift.wet.value = 0
      }
      return true
    }
    const graph = await ensureGraph(audioEl)
    if (!graph) return false
    graph.pitchShift.wet.value = 1
    graph.pitchShift.pitch = steps
    return true
  }

  function setSemitones(semitones) {
    if (!nodes?.pitchShift) return
    const steps = clampSemitones(semitones)
    nodes.pitchShift.wet.value = steps === 0 ? 0 : 1
    nodes.pitchShift.pitch = steps
  }

  function detach() {
    disposeNodes()
  }

  return { attach, detach, enabled, error, setSemitones }
}

export { clampSemitones, MAX_PITCH_SHIFT }
