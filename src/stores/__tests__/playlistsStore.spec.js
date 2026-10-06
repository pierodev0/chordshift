import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePlaylistsStore } from '../playlistsStore'

const storage = new Map()

vi.stubGlobal('localStorage', {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => { storage.set(key, String(value)) },
  removeItem: (key) => { storage.delete(key) },
  clear: () => { storage.clear() },
})

describe('playlistsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('create() adds a playlist with correct defaults', () => {
    const store = usePlaylistsStore()
    const playlist = store.create({ name: 'My Playlist' })

    expect(playlist).toHaveProperty('id')
    expect(playlist.name).toBe('My Playlist')
    expect(playlist.songIds).toEqual([])
    expect(playlist.createdAt).toEqual(expect.any(Number))
    expect(playlist.updatedAt).toEqual(expect.any(Number))
  })

  it('addSong() adds a songId to the playlist', () => {
    const store = usePlaylistsStore()
    const playlist = store.create({ name: 'Playlist' })

    store.addSong(playlist.id, 'song-1')

    const updated = store.getById(playlist.id)
    expect(updated.songIds).toContain('song-1')
  })

  it('removeSong() removes a songId from the playlist', () => {
    const store = usePlaylistsStore()
    const playlist = store.create({ name: 'Playlist' })

    store.addSong(playlist.id, 'song-1')
    store.addSong(playlist.id, 'song-2')
    store.removeSong(playlist.id, 'song-1')

    const updated = store.getById(playlist.id)
    expect(updated.songIds).toEqual(['song-2'])
  })
})
