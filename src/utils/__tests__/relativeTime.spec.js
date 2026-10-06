import { describe, it, expect } from 'vitest'
import { formatRelativeTime } from '../relativeTime'

describe('formatRelativeTime', () => {
  it('returns empty string for null', () => {
    expect(formatRelativeTime(null)).toBe('')
  })

  it('returns hace un momento for recent timestamps', () => {
    expect(formatRelativeTime(Date.now() - 10000)).toBe('hace un momento')
  })

  it('returns minutes for timestamps within the hour', () => {
    expect(formatRelativeTime(Date.now() - 5 * 60 * 1000)).toBe('hace 5 min')
  })

  it('returns hours for timestamps within the day', () => {
    expect(formatRelativeTime(Date.now() - 3 * 60 * 60 * 1000)).toBe('hace 3 h')
  })

  it('returns days for timestamps within the month', () => {
    expect(formatRelativeTime(Date.now() - 2 * 24 * 60 * 60 * 1000)).toBe('hace 2 d')
  })
})
