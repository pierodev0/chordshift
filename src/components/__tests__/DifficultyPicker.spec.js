import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DifficultyPicker from '../DifficultyPicker.vue'

describe('DifficultyPicker', () => {
  it('renders 10 stars', () => {
    const wrapper = mount(DifficultyPicker, { props: { modelValue: 0 } })

    expect(wrapper.findAll('[data-testid="difficulty-star"]').length).toBe(10)
    expect(wrapper.text()).toContain('Sin definir')
  })

  it('emits the tapped value', async () => {
    const wrapper = mount(DifficultyPicker, { props: { modelValue: 0 } })

    await wrapper.findAll('[data-testid="difficulty-star"]')[6].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[7]])
  })

  it('clears the value when tapping the selected star', async () => {
    const wrapper = mount(DifficultyPicker, { props: { modelValue: 7 } })

    await wrapper.findAll('[data-testid="difficulty-star"]')[6].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[0]])
  })

  it('shows the current value as N/10', () => {
    const wrapper = mount(DifficultyPicker, { props: { modelValue: 7 } })

    expect(wrapper.text()).toContain('7/10')
  })
})
