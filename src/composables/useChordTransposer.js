const notes = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
]
const flats = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
]

const chordRegex =
  /\b([A-G][b#]?(?:maj|min|m|M|aug|dim|sus|add|alt|b5|#5|[0-9]|\+|\-|\(|\))*)(?:\/([A-G][b#]?))?\b/g

export function useChordTransposer() {
  function isChordLine(line) {
    if (!line.trim()) return false
    const words = line.trim().split(/\s+/)
    let chordLike = 0

    words.forEach((w) => {
      const clean = w.replace(/[()]/g, '')
      if (
        clean.match(
          /^[A-G][b#]?(maj|min|m|M|aug|dim|sus|add|alt|b5|#5|[0-9]|\+|\-|\(|\/)*$/,
        )
      ) {
        chordLike++
      }
    })

    const hasLongWords = words.some((w) => w.length > 8)
    return chordLike / words.length > 0.4 && !hasLongWords
  }

  function transposeNote(chordPart, steps) {
    return chordPart.replace(/[A-G][b#]?/, (note) => {
      let index = notes.indexOf(note)
      let useFlats = false

      if (index === -1) {
        index = flats.indexOf(note)
        if (index !== -1) useFlats = true
      }

      if (index === -1) return note

      let newIndex = (index + steps) % 12
      while (newIndex < 0) newIndex += 12

      return useFlats ? flats[newIndex] : notes[newIndex]
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

  return { chordRegex, isChordLine, transposeNote, escapeHTML }
}
