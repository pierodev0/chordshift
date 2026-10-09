import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clampSemitones, MAX_PITCH_SHIFT, useAudioPitch } from '../useAudioPitch'

vi.mock('tone', () => ({
  start: vi.fn(),
  getContext: vi.fn(),
  PitchShift: vi.fn(),
}))

describe('clampSemitones', () => {
  it('rounds fractional semitones', () => {
    expect(clampSemitones(1.6)).toBe(2)
    expect(clampSemitones(-1.6)).toBe(-2)
  })

  it('clamps to one octave in each direction', () => {
    expect(clampSemitones(MAX_PITCH_SHIFT + 5)).toBe(MAX_PITCH_SHIFT)
    expect(clampSemitones(-MAX_PITCH_SHIFT - 5)).toBe(-MAX_PITCH_SHIFT)
  })

  it('returns 0 for non-finite values', () => {
    expect(clampSemitones(NaN)).toBe(0)
    expect(clampSemitones(Infinity)).toBe(0)
  })
})

describe('useAudioPitch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not build a pitch graph at 0 semitones', async () => {
    const { attach, enabled } = useAudioPitch()
    const audio = document.createElement('audio')
    expect(await attach(audio, 0)).toEqual({ attached: false, element: audio })
    expect(enabled.value).toBe(false)
  })

  it('routes local audio through PitchShift with clamped semitones', async () => {
    const tone = await import('tone')
    const connect = vi.fn()
    const disconnect = vi.fn()
    const toDestination = vi.fn()
    const dispose = vi.fn()
    let instance = null
    tone.PitchShift.mockImplementation(function (pitch) {
      instance = { pitch, toDestination, dispose }
      return instance
    })
    tone.getContext.mockReturnValue({
      rawContext: { createMediaElementSource: vi.fn(() => ({ connect, disconnect })) },
    })

    const { attach, detach, enabled, setSemitones } = useAudioPitch()
    const audio = document.createElement('audio')
    audio.src = 'song.mp3'
    const result = await attach(audio, MAX_PITCH_SHIFT + 4)
    expect(result.attached).toBe(true)
    expect(result.element).not.toBe(audio)
    expect(result.element.src).toBe(audio.src)
    expect(result.element.crossOrigin).toBe('anonymous')
    expect(enabled.value).toBe(true)
    expect(tone.PitchShift).toHaveBeenCalledWith(MAX_PITCH_SHIFT)
    expect(connect).toHaveBeenCalledTimes(1)

    setSemitones(-MAX_PITCH_SHIFT - 2)
    expect(instance.pitch).toBe(-MAX_PITCH_SHIFT)

    detach()
    expect(dispose).toHaveBeenCalledTimes(1)
    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(enabled.value).toBe(false)
  })

  it('falls back to plain audio when the graph cannot be built', async () => {
    const tone = await import('tone')
    tone.getContext.mockImplementation(() => {
      throw new Error('no webaudio')
    })

    const { attach, enabled } = useAudioPitch()
    const audio = document.createElement('audio')
    const result = await attach(audio, 2)
    expect(result).toEqual({ attached: false, element: audio })
    expect(enabled.value).toBe(false)
  })
})
