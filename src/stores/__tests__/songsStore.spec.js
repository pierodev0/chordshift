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
      update: vi.fn((song, opts) => {
        const idx = songs.findIndex((s) => s.id === song.id)
        if (idx === -1) return null
        songs[idx] = { ...songs[idx], ...song, updatedAt: opts?.touch === false ? songs[idx].updatedAt : Date.now() }
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

  it('create() defaults playCount to 0 and lastPlayedAt to null', () => {
    const store = useSongsStore()
    const song = store.create({ title: 'Tocada' })

    expect(song.playCount).toBe(0)
    expect(song.lastPlayedAt).toBeNull()
  })

  it('recordPlay() increments playCount without touching updatedAt', () => {
    const store = useSongsStore()
    const song = store.create({ title: 'Tocada' })
    const originalUpdatedAt = song.updatedAt

    const updated = store.recordPlay(song.id)

    expect(updated.playCount).toBe(1)
    expect(updated.lastPlayedAt).toEqual(expect.any(Number))
    expect(updated.updatedAt).toBe(originalUpdatedAt)
    expect(store.recordPlay(song.id).playCount).toBe(2)
  })

  it('recordPlay() returns null for unknown id', () => {
    const store = useSongsStore()
    expect(store.recordPlay('missing')).toBeNull()
  })

  it('mostPlayed returns top 5 by playCount desc with lastPlayedAt tiebreak', () => {
    const store = useSongsStore()
    const songs = []
    for (let i = 0; i < 7; i++) songs.push(store.create({ title: 'Song ' + i }))
    songs.forEach((s, i) => {
      for (let n = 0; n < i; n++) store.recordPlay(s.id)
    })
    store.recordPlay(songs[0].id)

    const top = store.mostPlayed
    expect(top.length).toBe(5)
    expect(top.map((s) => s.title)).toEqual(['Song 6', 'Song 5', 'Song 4', 'Song 3', 'Song 2'])
  })

  it('load() migrates legacy songs without play fields', () => {
    mockSongs.push({ id: 'legacy', title: 'Legacy', updatedAt: Date.now() })
    const store = useSongsStore()
    store.load()

    expect(store.getById('legacy').playCount).toBe(0)
    expect(store.getById('legacy').lastPlayedAt).toBeNull()
  })
})
