import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSongsStore } from '../songsStore'

const { mockSongs, mockAdapter } = vi.hoisted(() => {
  const songs = []
  return {
    mockSongs: songs,
    mockAdapter: {
      getAll: vi.fn(() => [...songs]),
      getById: vi.fn((id) => songs.find((s) => s.id === id) || null),
      create: vi.fn((song) => { songs.unshift(song); return song }),
      update: vi.fn((song) => {
        const idx = songs.findIndex((s) => s.id === song.id)
        if (idx === -1) return null
        songs[idx] = { ...songs[idx], ...song, updatedAt: Date.now() }
        return songs[idx]
      }),
      delete: vi.fn((id) => {
        const idx = songs.findIndex((s) => s.id === id)
        if (idx !== -1) songs.splice(idx, 1)
      }),
    },
  }
})

vi.mock('../adapters/localStorageAdapter', () => ({
  localStorageAdapter: mockAdapter,
}))

describe('songsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockSongs.length = 0
    vi.clearAllMocks()
  })

  it('create() adds a song with correct defaults', () => {
    const store = useSongsStore()
    const song = store.create({ title: 'Test Song', artist: 'Test Artist' })

    expect(song).toHaveProperty('id')
    expect(song.title).toBe('Test Song')
    expect(song.artist).toBe('Test Artist')
    expect(song.transpose).toBe(0)
    expect(song.createdAt).toEqual(expect.any(Number))
    expect(song.updatedAt).toEqual(expect.any(Number))
  })

  it('getById() returns the correct song', () => {
    const store = useSongsStore()
    const song = store.create({ title: 'Song A' })
    const found = store.getById(song.id)

    expect(found).not.toBeNull()
    expect(found.id).toBe(song.id)
    expect(found.title).toBe('Song A')
  })

  it('update() modifies fields and bumps updatedAt', () => {
    const store = useSongsStore()
    const song = store.create({ title: 'Original' })
    const originalUpdatedAt = song.updatedAt

    const updated = store.update(song.id, { title: 'Updated' })
    expect(updated.title).toBe('Updated')
    expect(updated.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt)
  })

  it('remove() deletes the song', () => {
    const store = useSongsStore()
    const song = store.create({ title: 'To Delete' })

    store.remove(song.id)

    expect(store.getById(song.id)).toBeNull()
  })

  it('sortedSongs returns songs ordered by updatedAt descending', () => {
    const store = useSongsStore()
    const older = store.create({ title: 'Older' })
    const newer = store.create({ title: 'Newer' })

    const sorted = store.sortedSongs
    expect(sorted[0].id).toBe(newer.id)
    expect(sorted[1].id).toBe(older.id)
  })
})
