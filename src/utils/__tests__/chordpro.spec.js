import { describe, it, expect } from 'vitest'
import {
  positionedToChordPro,
  parseSongContent,
  padSegmentsForChords,
  transposeChord,
  isSectionLine,
  chordsIn,
} from '../chordpro'

describe('positionedToChordPro', () => {
  it('ancla cada acorde al carácter exacto de su columna', () => {
    const input = [' Dm7          G', ' Yo pienso que'].join('\n')
    expect(positionedToChordPro(input)).toBe(' [Dm7]Yo pienso que[G]')
  })

  it('mantiene la columna del acorde dentro de una palabra', () => {
    const input = ['               Cmaj7', 'no son tan inutiles'].join('\n')
    expect(positionedToChordPro(input)).toBe('no son tan inut[Cmaj7]iles')
  })

  it('ancla al final al acorde que se pasa del largo de la letra', () => {
    const chordLine = ' Dm7' + ' '.repeat(30) + 'G'
    const input = [chordLine, ' Al menos quédate solo esta noche'].join('\n')
    expect(positionedToChordPro(input)).toBe(' [Dm7]Al menos quédate solo esta noche[G]')
  })

  it('apila dos acordes anclados al mismo carácter', () => {
    const input = ['                 Fmaj7  Dm7', 'y luego márchate'].join('\n')
    expect(positionedToChordPro(input)).toBe('y luego márchate[Fmaj7][Dm7]')
  })

  it('mueve al siguiente palabra al acorde que cae sobre un espacio', () => {
    const input = ['Dm7 G', 'hola mundo'].join('\n')
    expect(positionedToChordPro(input)).toBe('[Dm7]hola [G]mundo')
  })

  it('convierte una línea de acordes suelta en acordes ChordPro', () => {
    const input = '[Intro]\n\nDm7 G Dm9 G\n'
    expect(positionedToChordPro(input)).toBe('[Intro]\n\n[Dm7] [G] [Dm9] [G]\n')
  })

  it('normaliza los finales de línea CRLF', () => {
    expect(positionedToChordPro('Dm7 G\r\nhola mundo\r\n')).toBe('[Dm7]hola [G]mundo\n')
  })

  it('es idempotente sobre contenido ya convertido', () => {
    const once = positionedToChordPro([' Dm7   G', 'Yo pienso que', ''].join('\n'))
    expect(positionedToChordPro(once)).toBe(once)
  })
})

describe('isSectionLine', () => {
  it('distingue las secciones de los acordes sueltos entre corchetes', () => {
    expect(isSectionLine('[Intro]')).toBe(true)
    expect(isSectionLine('[Chorus]')).toBe(true)
    expect(isSectionLine('[Dm7]')).toBe(false)
    expect(isSectionLine('[C/G]')).toBe(false)
    expect(isSectionLine('[Dm7] [G]')).toBe(false)
  })
})

describe('parseSongContent', () => {
  it('devuelve un modelo de líneas tipado', () => {
    const lines = parseSongContent('[Verse]\n Dm7   G\nYo pienso que\nAm\n')
    expect(lines).toEqual([
      { kind: 'section', label: 'Verse' },
      {
        kind: 'chorded',
        segments: [
          { chords: [], text: 'Y' },
          { chords: ['Dm7'], text: 'o pien' },
          { chords: ['G'], text: 'so que' },
        ],
      },
      { kind: 'chords', chords: ['Am'] },
      { kind: 'blank' },
    ])
  })

  it('las líneas sin acordes quedan como letra o vacías', () => {
    expect(parseSongContent('hola mundo')).toEqual([{ kind: 'lyric', text: 'hola mundo' }])
    expect(parseSongContent('a\n\nb')).toEqual([
      { kind: 'lyric', text: 'a' },
      { kind: 'blank' },
      { kind: 'lyric', text: 'b' },
    ])
  })

  it('mantiene el segmento con el acorde al final de la línea', () => {
    expect(parseSongContent('hola [Am]')).toEqual([
      {
        kind: 'chorded',
        segments: [
          { chords: [], text: 'hola ' },
          { chords: ['Am'], text: '' },
        ],
      },
    ])
  })
})

describe('padSegmentsForChords', () => {
  const labelOf = (chord) => transposeChord(chord, 1, 'sharps')

  it('rellena el fragmento con NBSP cuando el acorde es más ancho', () => {
    const segments = [{ chords: ['C'], text: 'ya' }]
    expect(padSegmentsForChords(segments, labelOf)).toEqual([
      { chords: ['C'], labels: ['C#'], text: 'ya\u00A0' },
    ])
  })

  it('no toca un fragmento que ya tiene ancho suficiente', () => {
    const segments = [{ chords: ['Am'], text: 'baila conmigo' }]
    expect(padSegmentsForChords(segments, labelOf)).toEqual([
      { chords: ['Am'], labels: ['A#m'], text: 'baila conmigo' },
    ])
  })

  it('mide el relleno con la etiqueta transpuesta y deja el texto inicial sin etiquetas', () => {
    const segments = [
      { chords: [], text: 'va ' },
      { chords: ['C', 'Cm'], text: '' },
    ]
    expect(padSegmentsForChords(segments, labelOf)).toEqual([
      { chords: [], labels: [], text: 'va ' },
      { chords: ['C', 'Cm'], labels: ['C#', 'C#m'], text: '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' },
    ])
  })
})

describe('transposeChord', () => {
  it('transpone raíz, cualidades y bajada', () => {
    expect(transposeChord('C', 2)).toBe('D')
    expect(transposeChord('C', -1)).toBe('B')
    expect(transposeChord('Cadd9', 1)).toBe('C#add9')
    expect(transposeChord('C/G', 2)).toBe('D/A')
    expect(transposeChord('Am', 0)).toBe('Am')
    expect(transposeChord('Bb', 1, 'sharps')).toBe('B')
    expect(transposeChord('B', 1, 'flats')).toBe('C')
  })
})


