import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { uuid } from '../utils/uuid'

const STORAGE_KEY = 'chordshift-playlists'

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const usePlaylistsStore = defineStore('playlists', () => {
  const playlists = ref([])
  const loaded = ref(false)

  function load() {
    playlists.value = loadAll()
    loaded.value = true
  }

  const sortedPlaylists = computed(() =>
    [...playlists.value].sort((a, b) => b.updatedAt - a.updatedAt),
  )

  function getById(id) {
    return playlists.value.find((p) => p.id === id) || null
  }

  function create({ name }) {
    const playlist = {
      id: uuid(),
      name,
      songIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    playlists.value.unshift(playlist)
    saveAll(playlists.value)
    return playlist
  }

  function update(id, data) {
    const i = playlists.value.findIndex((p) => p.id === id)
    if (i === -1) return null
    playlists.value[i] = { ...playlists.value[i], ...data, updatedAt: Date.now() }
    saveAll(playlists.value)
    return playlists.value[i]
  }

  function remove(id) {
    playlists.value = playlists.value.filter((p) => p.id !== id)
    saveAll(playlists.value)
  }

  function addSong(playlistId, songId) {
    const p = getById(playlistId)
    if (!p || p.songIds.includes(songId)) return
    update(playlistId, { songIds: [...p.songIds, songId] })
  }

  function removeSong(playlistId, songId) {
    const p = getById(playlistId)
    if (!p) return
    update(playlistId, { songIds: p.songIds.filter((id) => id !== songId) })
  }

  function exportAll() {
    return loadAll()
  }

  function replaceAll(items) {
    playlists.value = items
    saveAll(items)
  }

  function clearAll() {
    playlists.value = []
    saveAll([])
  }

  return {
    playlists, loaded, sortedPlaylists,
    getById, create, update, remove, addSong, removeSong, load,
    exportAll, replaceAll, clearAll,
  }
})
