import { describe, it, expect } from 'vitest'
import { extractYoutubeId, isValidYoutubeUrl } from '../youtube'

describe('extractYoutubeId', () => {
  it('extracts from watch URL', () => {
    expect(extractYoutubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })
  it('extracts from short youtu.be URL', () => {
    expect(extractYoutubeId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })
  it('extracts from embed URL', () => {
    expect(extractYoutubeId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
  })
  it('returns null for invalid URL', () => {
    expect(extractYoutubeId('not a url')).toBeNull()
  })
  it('returns null for empty string', () => {
    expect(extractYoutubeId('')).toBeNull()
  })
})

describe('isValidYoutubeUrl', () => {
  it('returns true for valid URLs', () => {
    expect(isValidYoutubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true)
  })
  it('returns false for invalid URLs', () => {
    expect(isValidYoutubeUrl('not a url')).toBe(false)
  })
})
