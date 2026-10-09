import { describe, it, expect, vi, beforeEach } from 'vitest'
import { clampSemitones, MAX_PITCH_SHIFT, useAudioPitch } from '../useAudioPitch'

vi.mock('tone', () => ({
  start: vi.fn(),
  getContext: vi.fn(),
  connect: vi.fn(),
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

  it('returns true at 0 semitones without building a graph', async () => {
    const tone = await import('tone')
    const { attach, enabled } = useAudioPitch()
    const audio = document.createElement('audio')
    expect(await attach(audio, 0)).toBe(true)
    expect(enabled.value).toBe(false)
    expect(tone.PitchShift).not.toHaveBeenCalled()
  })

  it('routes local audio through PitchShift with clamped semitones', async () => {
    const tone = await import('tone')
    const mediaStream = { connect: vi.fn(), disconnect: vi.fn() }
    const createMediaElementSource = vi.fn(() => mediaStream)
    const toDestination = vi.fn()
    const dispose = vi.fn()
    let instance = null
    tone.PitchShift.mockImplementation(function () {
      instance = { pitch: 0, wet: { value: 0 }, toDestination, dispose }
      return instance
    })
    tone.getContext.mockReturnValue({
      rawContext: { createMediaElementSource, resume: vi.fn() },
    })

    const { attach, detach, enabled, setSemitones } = useAudioPitch()
    const audio = document.createElement('audio')
    audio.src = 'song.mp3'
    expect(await attach(audio, MAX_PITCH_SHIFT + 4)).toBe(true)
    expect(enabled.value).toBe(true)
    expect(createMediaElementSource).toHaveBeenCalledTimes(1)
    expect(tone.connect).toHaveBeenCalledWith(mediaStream, instance)
    expect(instance.wet.value).toBe(1)
    expect(instance.pitch).toBe(MAX_PITCH_SHIFT)

    // Second transpose reuses the graph instead of creating a new MediaElementSource
    expect(await attach(audio, -3)).toBe(true)
    expect(createMediaElementSource).toHaveBeenCalledTimes(1)
    expect(instance.pitch).toBe(-3)

    // Back to zero bypasses the effect without tearing down the graph
    expect(await attach(audio, 0)).toBe(true)
    expect(instance.wet.value).toBe(0)
    expect(instance.pitch).toBe(0)

    setSemitones(-MAX_PITCH_SHIFT - 2)
    expect(instance.wet.value).toBe(1)
    expect(instance.pitch).toBe(-MAX_PITCH_SHIFT)

    detach()
    expect(dispose).toHaveBeenCalledTimes(1)
    expect(mediaStream.disconnect).toHaveBeenCalledTimes(1)
    expect(enabled.value).toBe(false)
  })

  it('falls back to plain audio when the graph cannot be built', async () => {
    const tone = await import('tone')
    tone.getContext.mockImplementation(() => {
      throw new Error('no webaudio')
    })

    const { attach, enabled } = useAudioPitch()
    const audio = document.createElement('audio')
    expect(await attach(audio, 2)).toBe(false)
    expect(enabled.value).toBe(false)
  })
})
