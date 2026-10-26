import { useChordTransposer } from '../composables/useChordTransposer'

const { chordRegex, isChordLine, isChordName, transposeNote } = useChordTransposer()

const CHORD_TOKEN = /\[([^\[\]]+)\]/g
const SECTION_LINE = /^\[([^\[\]]+)\]$/
const NBSP = '\u00A0'

function normalize(text) {
  return String(text ?? '').replace(/\r\n?/g, '\n')
}

function isSpace(char) {
  return /\s/.test(char)
}

export function isSectionLine(line) {
  const match = String(line || '').trim().match(SECTION_LINE)
  return !!match && !isChordName(match[1])
}

function hasChordPro(text) {
  return /\[[^\[\]]+\]/.test(text)
}

function findPositionedChords(line) {
  const re = new RegExp(chordRegex.source, 'g')
  const found = []
  let m
  while ((m = re.exec(line)) !== null) {
    found.push({ col: m.index, chord: m[0] })
  }
  return found
}

// The source sheet is monospaced, so a chord's column already names the
// character it hangs over: the column maps straight onto that character. A
// chord written on a space moves forward to the next word (spaces carry no
// lyric), and one written past the end of the lyric clamps to the line end
// instead of floating after it.
function anchorAt(lyric, col) {
  const len = lyric.length
  if (col >= len) return len
  let at = Math.max(0, col)
  while (at < len && isSpace(lyric[at])) at++
  return at
}

function mergeChordLine(chordLine, lyric) {
  const groups = []
  let position = 0
  for (const found of findPositionedChords(chordLine)) {
    let target = anchorAt(lyric, found.col)
    if (target < position) target = position
    const last = groups[groups.length - 1]
    if (last && last.at === target) last.chords.push(found.chord)
    else groups.push({ at: target, chords: [found.chord] })
    position = target
  }

  let out = ''
  let cursor = 0
  for (const group of groups) {
    out += lyric.slice(cursor, group.at)
    out += group.chords.map((c) => `[${c}]`).join('')
    cursor = group.at
  }
  return out + lyric.slice(cursor)
}

function chordOnlyLine(chordLine) {
  return findPositionedChords(chordLine)
    .map((found) => `[${found.chord}]`)
    .join(' ')
}

// Converts the classic positioned sheet (chords on their own line above the
// lyrics, columns aligning both lines) into ChordPro, where each chord lives
// inside the lyric line it belongs to. Idempotent: running it over already
// converted content returns the same text.
export function positionedToChordPro(text) {
  const lines = normalize(text).split('\n')
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) {
      out.push('')
      continue
    }
    if (isSectionLine(line)) {
      out.push(line.trim())
      continue
    }
    if (isChordLine(line)) {
      const next = lines[i + 1]
      const canFold =
        next !== undefined &&
        next.trim() !== '' &&
        !isChordLine(next) &&
        !isSectionLine(next) &&
        !hasChordPro(next)
      if (canFold) {
        out.push(mergeChordLine(line, next))
        i++
        continue
      }
      out.push(chordOnlyLine(line))
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

function findChordTokens(line) {
  const re = new RegExp(CHORD_TOKEN.source, 'g')
  const found = []
  let m
  while ((m = re.exec(line)) !== null) {
    found.push({ start: m.index, end: m.index + m[0].length, chord: m[1] })
  }
  return found
}

// Splits a chorded line into segments. Each segment starts at a chord anchor
// and owns the lyric text that follows it, so a segment can be drawn as one
// cell (chord row over its own words) without ever overlapping its siblings.
function buildSegments(line, tokens) {
  const atoms = []
  let cursor = 0
  for (const token of tokens) {
    if (token.start > cursor) atoms.push({ kind: 'text', value: line.slice(cursor, token.start) })
    atoms.push({ kind: 'chord', value: token.chord })
    cursor = token.end
  }
  if (cursor < line.length) atoms.push({ kind: 'text', value: line.slice(cursor) })

  const segments = []
  for (const atom of atoms) {
    if (atom.kind === 'chord') {
      segments.push({ chords: [atom.value], text: '' })
    } else if (segments.length === 0) {
      segments.push({ chords: [], text: atom.value })
    } else {
      segments[segments.length - 1].text += atom.value
    }
  }
  return segments
}

function parseLine(line) {
  if (!line.trim()) return { kind: 'blank' }

  const section = line.trim().match(SECTION_LINE)
  if (section && !isChordName(section[1])) return { kind: 'section', label: section[1].trim() }

  const tokens = findChordTokens(line)
  if (tokens.length === 0) return { kind: 'lyric', text: line }

  const outside = line.replace(new RegExp(CHORD_TOKEN.source, 'g'), '')
  if (!outside.trim()) return { kind: 'chords', chords: tokens.map((token) => token.chord) }

  return { kind: 'chorded', segments: buildSegments(line, tokens) }
}

export function parseChordPro(text) {
  return normalize(text).split('\n').map(parseLine)
}

// Campfire's padLyricsToFitChords: the fragment of lyric that a chord sits on
// is padded with non-breaking spaces until it is at least as wide as the
// chord's label (measured in characters, which a monospaced font makes exact),
// so consecutive chords never overlap and the line only wraps where the padded
// text allows it. Labels come from `labelOf` (the transposed name), and the
// padding belongs to the render: the stored content stays untouched.
export function padSegmentsForChords(segments, labelOf) {
  return segments.map((segment) => {
    const labels = segment.chords.map(labelOf)
    const rowWidth = labels.reduce((width, label) => width + label.length + 1, 0)
    const missing = Math.max(0, rowWidth - segment.text.length)
    if (!missing) return { ...segment, labels }
    return { ...segment, labels, text: segment.text + NBSP.repeat(missing) }
  })
}

// Single entry point for the viewer: accepts both the legacy positioned
// format and ChordPro, and always returns the structured line model.
export function parseSongContent(text) {
  return parseChordPro(positionedToChordPro(text))
}

export function chordsIn(text) {
  const chords = []
  for (const line of parseSongContent(text)) {
    if (line.kind === 'chords') chords.push(...line.chords)
    else if (line.kind === 'chorded') {
      for (const segment of line.segments) chords.push(...segment.chords)
    }
  }
  return chords
}

export function transposeChord(chord, steps, accidental = 'sharps') {
  if (!steps) return chord
  const [root, bass] = chord.split('/')
  const transposed = transposeNote(root, steps, accidental)
  if (!bass) return transposed
  return transposed + '/' + transposeNote(bass, steps, accidental)
}
