const STORAGE_KEY = 'chordshift-songs'
let _cache = null

function loadAll() {
  if (_cache === null) {
    try {
      _cache = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      _cache = []
    }
  }
  return _cache
}

function saveAll() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache))
}

// Invalidate cache when another tab changes localStorage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      _cache = null
    }
  })
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
    saveAll()
    return song
  },

  update(song) {
    const songs = loadAll()
    const i = songs.findIndex((s) => s.id === song.id)
    if (i === -1) return null
    songs[i] = { ...songs[i], ...song, updatedAt: Date.now() }
    saveAll()
    return songs[i]
  },

  delete(id) {
    _cache = loadAll().filter((s) => s.id !== id)
    saveAll()
  },

  replaceAll(songs) {
    _cache = songs
    saveAll()
  },

  clearAll() {
    _cache = []
    saveAll()
  },
}
