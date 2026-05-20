import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { uuid } from '../utils/uuid'

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
    const all = loadAll()
    all.unshift(playlist)
    saveAll(all)
    playlists.value.unshift(playlist)
    return playlist
  }

  function update(id, data) {
    const all = loadAll()
    const i = all.findIndex((p) => p.id === id)
    if (i === -1) return null
    all[i] = { ...all[i], ...data, updatedAt: Date.now() }
    saveAll(all)
    const j = playlists.value.findIndex((p) => p.id === id)
    if (j !== -1) playlists.value[j] = all[i]
    return all[i]
  }

  function remove(id) {
    const all = loadAll().filter((p) => p.id !== id)
    saveAll(all)
    playlists.value = playlists.value.filter((p) => p.id !== id)
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

  return {
    playlists, loaded, sortedPlaylists,
    getById, create, update, remove, addSong, removeSong, load,
  }
})
