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
    if (nodes?.element) {
      try {
        nodes.element.crossOrigin = null
      } catch {
        // crossOrigin cleanup is optional
      }
      try {
        nodes.element.removeAttribute('crossorigin')
      } catch {
        // crossOrigin cleanup is optional
      }
    }
    nodes = null
    enabled.value = false
  }

  async function attach(audioEl, semitones = 0) {
    disposeNodes()
    error.value = null
    if (!audioEl) return { attached: false, element: audioEl }
    const steps = clampSemitones(semitones)
    if (steps === 0) return { attached: false, element: audioEl }

    let ToneModule
    try {
      ToneModule = await import('tone')
    } catch (err) {
      error.value = err
      return { attached: false, element: audioEl }
    }

    try {
      // MediaElementSource can only be created once per element per context,
      // so clone the element before routing it through the pitch graph.
      const element = audioEl.cloneNode()
      element.src = audioEl.src
      element.currentTime = audioEl.currentTime || 0
      element.playbackRate = audioEl.playbackRate || 1
      element.preservesPitch = true
      element.crossOrigin = 'anonymous'
      await ToneModule.start()
      const context = ToneModule.getContext()
      const mediaStream = context.rawContext.createMediaElementSource(element)
      const pitchShift = new ToneModule.PitchShift(steps)
      mediaStream.connect(pitchShift)
      pitchShift.toDestination()
      nodes = { element, pitchShift, source: mediaStream }
      enabled.value = true
      return { attached: true, element }
    } catch (err) {
      error.value = err
      disposeNodes()
      return { attached: false, element: audioEl }
    }
  }

  function setSemitones(semitones) {
    if (!nodes?.pitchShift) return
    nodes.pitchShift.pitch = clampSemitones(semitones)
  }

  function detach() {
    disposeNodes()
  }

  return { attach, detach, enabled, error, setSemitones }
}

export { clampSemitones, MAX_PITCH_SHIFT }
