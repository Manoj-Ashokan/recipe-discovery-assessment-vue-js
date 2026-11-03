import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import MealImage from './MealImage.vue'

describe('MealImage', () => {
  it('lazy-loads list thumbnails by default', () => {
    const wrapper = mount(MealImage, {
      props: {
        src: 'https://example.com/meal.jpg',
        alt: 'Sample meal',
      },
    })

    const img = wrapper.get('img')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('fetchpriority')).toBe('low')
    expect(img.attributes('decoding')).toBe('async')
  })

  it('prioritizes the hero image on detail pages', () => {
    const wrapper = mount(MealImage, {
      props: {
        src: 'https://example.com/meal.jpg',
        alt: 'Sample meal',
        priority: 'high',
      },
    })

    const img = wrapper.get('img')
    expect(img.attributes('loading')).toBe('eager')
    expect(img.attributes('fetchpriority')).toBe('high')
  })
})
