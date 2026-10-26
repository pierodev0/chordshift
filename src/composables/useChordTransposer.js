const notes = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
]
const flats = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
]

// The trailing lookahead replaces the old `\b`: a word boundary never fires
// after `#` (so `F#` used to match as `F`), while letters still stop `Am` from
// eating the start of "Amigo". `[b#][0-9]+` covers the alterations after a
// digit (`C7b9`, `Cmaj7#11`), and a parenthesised annotation (`Cadd9(no3)`)
// is taken whole.
const chordRegex =
  /\b([A-G][b#]?(?:maj|min|add|dim|aug|sus|alt|[b#][0-9]+|[°ø]|m|M|[0-9]|\+|\-|\([^)]*\))*)(?:\/([A-G][b#]?))?(?![A-Za-z0-9#b])/g

export function useChordTransposer() {
  function isChordName(text) {
    const value = String(text || '').trim()
    if (!value) return false
    const match = value.match(new RegExp(chordRegex.source))
    return !!match && match[0] === value
  }

  function isChordLine(line) {
    if (!line.trim()) return false
    const words = line.trim().split(/\s+/)
    const chordLike = words.filter(isChordName).length
    return chordLike / words.length > 0.4
  }

  function transposeNote(chordPart, steps, accidental = 'sharps') {
    const preferFlats = accidental === 'flats'
    return chordPart.replace(/[A-G][b#]?/, (note) => {
      if (!steps) return note

      let index = notes.indexOf(note)
      if (index === -1) index = flats.indexOf(note)

      if (index === -1) return note

      let newIndex = (index + steps) % 12
      while (newIndex < 0) newIndex += 12

      return preferFlats ? flats[newIndex] : notes[newIndex]
    })
  }

  function escapeHTML(str) {
    return str.replace(
      /[&<>"']/g,
      (m) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[m],
    )
  }

  return { chordRegex, isChordLine, isChordName, transposeNote, escapeHTML }
}
