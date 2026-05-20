import { ref } from 'vue'
import { guess } from 'web-audio-beat-detector'

export function useBeatDetection() {
  const bpm = ref(0)
  const offset = ref(0)
  const beatTimes = ref([])
  const detected = ref(false)
  const detecting = ref(false)

  async function detect(audioBuffer) {
    if (!audioBuffer) return
    detecting.value = true
    try {
      const result = await guess(audioBuffer)
      bpm.value = result.bpm
      offset.value = result.offset
      const interval = 60 / result.bpm
      const times = []
      for (let t = result.offset; t < audioBuffer.duration; t += interval) {
        times.push(t)
      }
      beatTimes.value = times
      detected.value = true
    } catch {
      bpm.value = 0
      offset.value = 0
      beatTimes.value = []
      detected.value = false
    } finally {
      detecting.value = false
    }
  }

  function snapToBeat(time) {
    if (beatTimes.value.length === 0) return time
    let closest = beatTimes.value[0]
    let minDiff = Math.abs(time - closest)
    for (const bt of beatTimes.value) {
      const diff = Math.abs(time - bt)
      if (diff < minDiff) {
        minDiff = diff
        closest = bt
      }
    }
    return closest
  }

  function clear() {
    bpm.value = 0
    offset.value = 0
    beatTimes.value = []
    detected.value = false
    detecting.value = false
  }

  return { bpm, offset, beatTimes, detected, detecting, detect, snapToBeat, clear }
}
