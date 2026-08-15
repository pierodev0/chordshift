import { ref } from 'vue'

const STORAGE_KEY = 'chordshift-preferences'

const DEFAULT_CHORD_COLOR = '#f97316'

const stored = (() => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
})()

const chordColor = ref(stored.chordColor || DEFAULT_CHORD_COLOR)

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ chordColor: chordColor.value }))
}

export function usePreferences() {
  function setChordColor(color) {
    chordColor.value = color
    save()
  }

  return {
    chordColor,
    setChordColor,
  }
}
