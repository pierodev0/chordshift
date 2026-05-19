import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { localStorageAdapter } from './adapters/localStorageAdapter'

export const useSongsStore = defineStore('songs', () => {
  const songs = ref([])
  const loaded = ref(false)

  function load() {
    songs.value = localStorageAdapter.getAll()
    loaded.value = true
  }

  const sortedSongs = computed(() =>
    [...songs.value].sort((a, b) => b.updatedAt - a.updatedAt),
  )

  function getById(id) {
    return songs.value.find((s) => s.id === id) || null
  }

  function create({ title, artist, content }) {
    const song = {
      id: crypto.randomUUID(),
      title,
      artist: artist || '',
      content: content || '',
      transpose: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    localStorageAdapter.create(song)
    songs.value.unshift(song)
    return song
  }

  function update(id, data) {
    const updated = localStorageAdapter.update({ id, ...data })
    if (updated) {
      const i = songs.value.findIndex((s) => s.id === id)
      if (i !== -1) songs.value[i] = updated
    }
    return updated
  }

  function remove(id) {
    localStorageAdapter.delete(id)
    songs.value = songs.value.filter((s) => s.id !== id)
  }

  return { songs, loaded, sortedSongs, getById, create, update, remove, load }
})
