import { ref } from 'vue'

const STORAGE_KEY = 'chordshift-preferences'

const DEFAULT_CHORD_COLOR = '#f97316'
const DEFAULT_ACCIDENTAL = 'sharps'

const stored = (() => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
})()

const chordColor = ref(stored.chordColor || DEFAULT_CHORD_COLOR)
const accidental = ref(stored.accidental === 'flats' ? 'flats' : DEFAULT_ACCIDENTAL)

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ accidental: accidental.value, chordColor: chordColor.value }))
}

export function usePreferences() {
  function setAccidental(value) {
    accidental.value = value === 'flats' ? 'flats' : DEFAULT_ACCIDENTAL
    save()
  }

  function setChordColor(color) {
    chordColor.value = color
    save()
  }

  return {
    accidental,
    chordColor,
    setAccidental,
    setChordColor,
  }
}
