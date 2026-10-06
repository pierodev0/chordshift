import { describe, it, expect } from 'vitest'
import { sortSongs, normalizeText, SORT_DEFAULT_DIRECTIONS } from '../songSort'

function makeSong(overrides = {}) {
  return {
    id: overrides.id || Math.random().toString(36).slice(2),
    title: 'Sin título',
    artist: '',
    playCount: 0,
    lastPlayedAt: null,
    difficulty: 0,
    updatedAt: 0,
    ...overrides,
  }
}

describe('normalizeText', () => {
  it('lowercases and strips accents', () => {
    expect(normalizeText('Lamento Boliviano')).toBe('lamento boliviano')
    expect(normalizeText('Canción')).toBe('cancion')
  })
})

describe('sortSongs', () => {
  it('sorts recent desc by default', () => {
    const older = makeSong({ id: 'old', updatedAt: 1 })
    const newer = makeSong({ id: 'new', updatedAt: 2 })

    expect(sortSongs([older, newer], 'recent', 'desc').map((s) => s.id)).toEqual(['new', 'old'])
    expect(sortSongs([older, newer], 'recent', 'asc').map((s) => s.id)).toEqual(['old', 'new'])
  })

  it('sorts by name ignoring case and accents', () => {
    const songs = [
      makeSong({ id: 'b', title: 'Zamba' }),
      makeSong({ id: 'a', title: 'Álamo' }),
      makeSong({ id: 'c', title: 'lamento' }),
    ]

    expect(sortSongs(songs, 'name', 'asc').map((s) => s.id)).toEqual(['a', 'c', 'b'])
    expect(sortSongs(songs, 'name', 'desc').map((s) => s.id)).toEqual(['b', 'c', 'a'])
  })

  it('sorts by plays desc with lastPlayedAt tiebreak and unplayed last', () => {
    const songs = [
      makeSong({ id: 'unplayed', playCount: 0, updatedAt: 99 }),
      makeSong({ id: 'old-top', playCount: 5, lastPlayedAt: 1 }),
      makeSong({ id: 'new-top', playCount: 5, lastPlayedAt: 2 }),
      makeSong({ id: 'low', playCount: 2, lastPlayedAt: 9 }),
    ]

    expect(sortSongs(songs, 'plays', 'desc').map((s) => s.id)).toEqual([
      'new-top',
      'old-top',
      'low',
      'unplayed',
    ])
    const asc = sortSongs(songs, 'plays', 'asc').map((s) => s.id)
    expect(asc.slice(0, 3)).toEqual(['low', 'old-top', 'new-top'])
    expect(asc[3]).toBe('unplayed')
  })

  it('sorts by difficulty with unrated always last', () => {
    const songs = [
      makeSong({ id: 'unrated', difficulty: 0, updatedAt: 99 }),
      makeSong({ id: 'easy', difficulty: 2 }),
      makeSong({ id: 'hard', difficulty: 9 }),
    ]

    expect(sortSongs(songs, 'difficulty', 'desc').map((s) => s.id)).toEqual([
      'hard',
      'easy',
      'unrated',
    ])
    expect(sortSongs(songs, 'difficulty', 'asc').map((s) => s.id)).toEqual([
      'easy',
      'hard',
      'unrated',
    ])
  })

  it('has the agreed default directions', () => {
    expect(SORT_DEFAULT_DIRECTIONS).toEqual({
      recent: 'desc',
      name: 'asc',
      plays: 'desc',
      difficulty: 'desc',
    })
  })
})
