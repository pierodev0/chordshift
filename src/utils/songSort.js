export const SORT_KEYS = ['recent', 'name', 'plays', 'difficulty']

export const SORT_DEFAULT_DIRECTIONS = {
  recent: 'desc',
  name: 'asc',
  plays: 'desc',
  difficulty: 'desc',
}

export function normalizeText(text) {
  return (text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function compareNumbers(a, b, direction) {
  return direction === 'asc' ? a - b : b - a
}

export function sortSongs(songs, sortKey, direction) {
  const dir = direction === 'asc' ? 'asc' : 'desc'
  const list = [...songs]
  switch (sortKey) {
  case 'name':
    return list.sort((a, b) => {
      const cmp = normalizeText(a.title).localeCompare(normalizeText(b.title), 'es')
      return dir === 'asc' ? cmp : -cmp
    })
  case 'plays': {
    const played = list.filter((s) => (s.playCount || 0) > 0)
    const unplayed = list.filter((s) => (s.playCount || 0) === 0)
    played.sort((a, b) =>
      compareNumbers(a.playCount || 0, b.playCount || 0, dir) ||
        compareNumbers(a.lastPlayedAt || 0, b.lastPlayedAt || 0, dir),
    )
    unplayed.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    return [...played, ...unplayed]
  }
  case 'difficulty': {
    const rated = list.filter((s) => (s.difficulty || 0) > 0)
    const unrated = list.filter((s) => (s.difficulty || 0) === 0)
    rated.sort((a, b) => compareNumbers(a.difficulty || 0, b.difficulty || 0, dir))
    unrated.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    return [...rated, ...unrated]
  }
  case 'recent':
  default: {
    const sorted = list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    return dir === 'asc' ? sorted.reverse() : sorted
  }
  }
}
