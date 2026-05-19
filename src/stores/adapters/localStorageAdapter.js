const STORAGE_KEY = 'chordshift-songs'

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(songs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs))
}

export const localStorageAdapter = {
  getAll() {
    return loadAll()
  },

  getById(id) {
    return loadAll().find((s) => s.id === id) || null
  },

  create(song) {
    const songs = loadAll()
    songs.unshift(song)
    saveAll(songs)
    return song
  },

  update(song) {
    const songs = loadAll()
    const i = songs.findIndex((s) => s.id === song.id)
    if (i === -1) return null
    songs[i] = { ...songs[i], ...song, updatedAt: Date.now() }
    saveAll(songs)
    return songs[i]
  },

  delete(id) {
    const songs = loadAll().filter((s) => s.id !== id)
    saveAll(songs)
  },
}
