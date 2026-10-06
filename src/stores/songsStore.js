import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { localStorageAdapter } from './adapters/localStorageAdapter'
import { uuid } from '../utils/uuid'

export const useSongsStore = defineStore('songs', () => {
  const songs = ref([])
  const loaded = ref(false)

  const playDefaults = { playCount: 0, lastPlayedAt: null, difficulty: 0 }

  function normalizeDifficulty(value) {
    const n = Math.floor(Number(value) || 0)
    if (n < 0) return 0
    if (n > 10) return 10
    return n
  }

  function withPlayDefaults(song) {
    return {
      ...playDefaults,
      ...song,
      difficulty: normalizeDifficulty(song.difficulty),
    }
  }

  function load() {
    songs.value = localStorageAdapter.getAll().map(withPlayDefaults)
    loaded.value = true
  }

  const sortedSongs = computed(() =>
    [...songs.value].sort((a, b) => b.updatedAt - a.updatedAt),
  )

  const mostPlayed = computed(() =>
    [...songs.value]
      .filter((s) => (s.playCount || 0) > 0)
      .sort((a, b) => (b.playCount || 0) - (a.playCount || 0) || (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0))
      .slice(0, 5),
  )

  function getById(id) {
    return songs.value.find((s) => s.id === id) || null
  }

  function notifyChange() {
  window.dispatchEvent(new CustomEvent('chordshift-data-changed'))
}

function create({ title, artist, content, capo, audioKey, youtubeUrl, scrollDelay, duration, difficulty }) {
    const song = {
      id: uuid(),
      title,
      artist: artist || '',
      content: content || '',
      capo: capo || '',
      audioKey: audioKey || '',
      youtubeUrl: youtubeUrl || '',
      scrollDelay: scrollDelay !== undefined ? scrollDelay : 'auto',
      duration: duration > 0 ? Math.round(duration) : 0,
      preferredSource: '',
      ...playDefaults,
      difficulty: normalizeDifficulty(difficulty),
      transpose: 0,
      markers: [],
      loops: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    localStorageAdapter.create(song)
    songs.value.unshift(song)
    notifyChange()
    return song
  }

  function update(id, data) {
    const payload = { id, ...data }
    if (payload.difficulty !== undefined) payload.difficulty = normalizeDifficulty(payload.difficulty)
    const updated = localStorageAdapter.update(payload)
    if (updated) {
      const i = songs.value.findIndex((s) => s.id === id)
      if (i !== -1) songs.value[i] = updated
      notifyChange()
    }
    return updated
  }

  function remove(id) {
    localStorageAdapter.delete(id)
    songs.value = songs.value.filter((s) => s.id !== id)
    notifyChange()
  }

  function recordPlay(id) {
    const current = getById(id)
    if (!current) return null
    const updated = localStorageAdapter.update({
      id,
      playCount: (current.playCount || 0) + 1,
      lastPlayedAt: Date.now(),
    }, { touch: false })
    if (updated) {
      const i = songs.value.findIndex((s) => s.id === id)
      if (i !== -1) songs.value[i] = withPlayDefaults(updated)
      notifyChange()
    }
    return updated ? withPlayDefaults(updated) : null
  }

  function exportAll() {
    return localStorageAdapter.getAll().map(({ audioKey, ...song }) => song)
  }

  function importAll(songs) {
    const sanitized = songs.map(({ audioKey, ...song }) => withPlayDefaults(song))
    localStorageAdapter.replaceAll(sanitized)
    songs.value = [...sanitized]
    loaded.value = true
    notifyChange()
  }

  function clearAll() {
    localStorageAdapter.clearAll()
    songs.value = []
    notifyChange()
  }

  return { songs, loaded, sortedSongs, mostPlayed, getById, create, update, remove, recordPlay, load, exportAll, importAll, clearAll }
})
