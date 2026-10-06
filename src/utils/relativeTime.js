export function formatRelativeTime(ts) {
  if (!ts) return ''
  const diff = Date.now() - Number(ts)
  if (diff < 60 * 1000) return 'hace un momento'
  if (diff < 60 * 60 * 1000) return `hace ${Math.floor(diff / (60 * 1000))} min`
  if (diff < 24 * 60 * 60 * 1000) return `hace ${Math.floor(diff / (60 * 60 * 1000))} h`
  if (diff < 30 * 24 * 60 * 60 * 1000) return `hace ${Math.floor(diff / (24 * 60 * 60 * 1000))} d`
  return new Date(Number(ts)).toLocaleDateString()
}
