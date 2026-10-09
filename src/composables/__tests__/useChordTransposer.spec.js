import { describe, it, expect } from 'vitest'
import { useChordTransposer } from '../useChordTransposer'

const { chordRegex, isChordLine, transposeNote, escapeHTML } = useChordTransposer()

describe('isChordLine', () => {
  it('detects chord lines correctly', () => {
    expect(isChordLine('Am  C  G  F')).toBe(true)
    expect(isChordLine('Fmaj7  Cadd9  Bb  G#m')).toBe(true)
  })

  it('rejects lyric and empty lines', () => {
    expect(isChordLine('Hello world this is a lyric line')).toBe(false)
    expect(isChordLine('')).toBe(false)
  })
})

describe('transposeNote', () => {
  it('transposes single notes correctly', () => {
    expect(transposeNote('C', 2)).toBe('D')
    expect(transposeNote('G', 5)).toBe('C')
  })

  it('keeps original spelling when no transposition is applied', () => {
    expect(transposeNote('Db', 0)).toBe('Db')
    expect(transposeNote('C#', 0)).toBe('C#')
  })

  it('uses sharps by default', () => {
    expect(transposeNote('C', 1)).toBe('C#')
    expect(transposeNote('Db', 1)).toBe('D')
    expect(transposeNote('Eb', 2)).toBe('F')
  })

  it('uses flats when preferred', () => {
    expect(transposeNote('C', 1, 'flats')).toBe('Db')
    expect(transposeNote('D', 1, 'flats')).toBe('Eb')
    expect(transposeNote('Db', 1, 'flats')).toBe('D')
    expect(transposeNote('A', 1, 'flats')).toBe('Bb')
  })

  it('wraps around octave correctly', () => {
    expect(transposeNote('B', 1)).toBe('C')
    expect(transposeNote('C', -1)).toBe('B')
    expect(transposeNote('A', 12)).toBe('A')
    expect(transposeNote('C', -12)).toBe('C')
  })
})

describe('chordRegex', () => {
  it('matches common chord patterns', () => {
    const result = 'Fmaj7  Cadd9  Bb  G#m'.match(chordRegex)
    expect(result).not.toBeNull()
    expect(result).toHaveLength(4)
  })
})

describe('escapeHTML', () => {
  it('escapes all 5 HTML entities', () => {
    expect(escapeHTML('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;')
  })
})
