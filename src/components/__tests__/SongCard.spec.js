import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SongCard from '../SongCard.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ name: 'songs' }),
}))

function makeSong(overrides = {}) {
  return {
    id: 'song-1',
    title: 'Lamento Boliviano',
    artist: 'Enanitos Verdes',
    content: '[Verse]\nLamento boliviano lorem ipsum dolor',
    capo: '',
    playCount: 0,
    lastPlayedAt: null,
    difficulty: 0,
    ...overrides,
  }
}

describe('SongCard play count badge', () => {
  it('shows 0 tocadas for a song never played', () => {
    const wrapper = mount(SongCard, { props: { song: makeSong() } })
    const badge = wrapper.find('[data-testid="play-count-badge"]')

    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('0')
    expect(badge.attributes('title')).toBe('0 tocadas')
  })

  it('shows the play count next to the lyric preview', () => {
    const wrapper = mount(SongCard, { props: { song: makeSong({ playCount: 7 }) } })
    const badge = wrapper.find('[data-testid="play-count-badge"]')

    expect(badge.text()).toContain('7')
    expect(badge.attributes('title')).toBe('7 tocadas')
    expect(wrapper.text()).toContain('[Verse]')
  })

  it('uses singular label for a single tocada', () => {
    const wrapper = mount(SongCard, { props: { song: makeSong({ playCount: 1 }) } })
    const badge = wrapper.find('[data-testid="play-count-badge"]')

    expect(badge.attributes('title')).toBe('1 tocada')
  })
})

describe('SongCard difficulty badge', () => {
  it('hides the badge when difficulty is not defined', () => {
    const wrapper = mount(SongCard, { props: { song: makeSong({ difficulty: 0 }) } })

    expect(wrapper.find('[data-testid="difficulty-badge"]').exists()).toBe(false)
  })

  it('shows the difficulty number with a star', () => {
    const wrapper = mount(SongCard, { props: { song: makeSong({ difficulty: 7 }) } })
    const badge = wrapper.find('[data-testid="difficulty-badge"]')

    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('7')
    expect(badge.attributes('title')).toBe('Dificultad 7 de 10')
  })
})
