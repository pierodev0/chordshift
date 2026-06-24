/**
 * Extract YouTube video ID from various URL formats.
 * Supports: youtu.be/..., youtube.com/v/..., youtube.com/embed/...,
 *           youtube.com/watch?v=..., &v=...
 */
export function extractYoutubeId(url) {
  if (!url) return null
  const m = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)
  return (m && m[2].length === 11) ? m[2] : null
}

export function isValidYoutubeUrl(url) {
  return extractYoutubeId(url) !== null
}
