import { describe, it, expect } from 'vitest'
import { useChordTransposer } from '../useChordTransposer'

const { chordRegex, isChordLine, transposeNote, escapeHTML } = useChordTransposer()

describe('isChordLine', () => {
  it('detects chord lines correctly', () => {
    expect(isChordLine('Am  C  G  F')).toBe(true)
    expect(isChordLine('Fmaj7  Cadd9  Bb  G#m')).toBe(true)
  })

  it('reconoce líneas con bajadas, sostenidos largos y anotaciones', () => {
    expect(isChordLine('C/G  D')).toBe(true)
    expect(isChordLine('F#  C#  A#')).toBe(true)
    expect(isChordLine('Fmaj7add11  C')).toBe(true)
    expect(isChordLine('Cmaj7(no3)  Dm9')).toBe(true)
    expect(isChordLine('| G   D   |   C   Em  |')).toBe(true)
    expect(isChordLine('Am  F  C  G  (x2)')).toBe(true)
  })

  it('rejects lyric and empty lines', () => {
    expect(isChordLine('Hello world this is a lyric line')).toBe(false)
    expect(isChordLine('')).toBe(false)
    expect(isChordLine('Capo 2')).toBe(false)
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

  it('matchea la alteración final en lugar de cortarla', () => {
    const all = (text) => [...text.matchAll(new RegExp(chordRegex.source, 'g'))].map((m) => m[0])
    expect(all('F# C# A#')).toEqual(['F#', 'C#', 'A#'])
    expect(all('C7b9 Cmaj7#11 C7#9')).toEqual(['C7b9', 'Cmaj7#11', 'C7#9'])
    expect(all('F#/A# D/F#')).toEqual(['F#/A#', 'D/F#'])
    expect(all('C/G Bb/C Cm(maj7) Cadd9(no3)')).toEqual(['C/G', 'Bb/C', 'Cm(maj7)', 'Cadd9(no3)'])
  })
})

describe('escapeHTML', () => {
  it('escapes all 5 HTML entities', () => {
    expect(escapeHTML('&<>"\'')).toBe('&amp;&lt;&gt;&quot;&#39;')
  })
})
