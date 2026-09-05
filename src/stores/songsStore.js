import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { localStorageAdapter } from './adapters/localStorageAdapter'
import { uuid } from '../utils/uuid'

export const useSongsStore = defineStore('songs', () => {
  const songs = ref([])
  const loaded = ref(false)

  function load() {
    songs.value = [...localStorageAdapter.getAll()]
    loaded.value = true
  }

  const sortedSongs = computed(() =>
    [...songs.value].sort((a, b) => b.updatedAt - a.updatedAt),
  )

  function getById(id) {
    return songs.value.find((s) => s.id === id) || null
  }

  function notifyChange() {
  window.dispatchEvent(new CustomEvent('chordshift-data-changed'))
}

function create({ title, artist, content, capo, audioKey, youtubeUrl, scrollDelay, duration }) {
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
    const updated = localStorageAdapter.update({ id, ...data })
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

  function exportAll() {
    return localStorageAdapter.getAll().map(({ audioKey, ...song }) => song)
  }

  function importAll(songs) {
    const sanitized = songs.map(({ audioKey, ...song }) => song)
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

  return { songs, loaded, sortedSongs, getById, create, update, remove, load, exportAll, importAll, clearAll }
})
