import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import RecipeCard from './RecipeCard.vue'

const meal = {
  idMeal: '52772',
  strMeal: 'Honey Teriyaki Salmon',
  strMealThumb: 'https://example.com/meal.jpg',
}

async function mountWithRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'dashboard', component: { template: '<div/>' } },
      { path: '/recipe/:id', name: 'recipe-detail', component: { template: '<div/>' } },
    ],
  })

  await router.push('/')
  await router.isReady()

  return mount(RecipeCard, {
    props: { meal, cuisine: 'Japanese' },
    global: {
      plugins: [router],
    },
  })
}

describe('RecipeCard', () => {
  it('renders meal title and links to detail route', async () => {
    const wrapper = await mountWithRouter()
    expect(wrapper.text()).toContain('Honey Teriyaki Salmon')
    expect(wrapper.text()).toContain('Japanese')

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/recipe/52772')

    const img = wrapper.get('img')
    expect(img.attributes('alt')).toBe('Honey Teriyaki Salmon dish')
  })
})
