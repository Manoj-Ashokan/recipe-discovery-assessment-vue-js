import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRecipesStore } from './recipes.js'

vi.mock('@/api/mealDb.js', () => ({
  FEATURED_CUISINES: ['Indian', 'Italian'],
  fetchAreas: vi.fn(),
  fetchMealsByArea: vi.fn(),
  fetchMealById: vi.fn(),
  searchMealsByName: vi.fn(),
}))

import {
  fetchMealsByArea,
  fetchMealById,
  searchMealsByName,
} from '@/api/mealDb.js'

describe('recipes store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads and sorts cuisine meals alphabetically', async () => {
    fetchMealsByArea.mockResolvedValue([
      { idMeal: '2', strMeal: 'Zebra Curry' },
      { idMeal: '1', strMeal: 'Apple Chutney' },
    ])

    const store = useRecipesStore()
    await store.loadCuisine('Indian')

    expect(store.cuisineStatus.Indian).toBe('success')
    expect(store.mealsByCuisine.Indian.map((m) => m.strMeal)).toEqual([
      'Apple Chutney',
      'Zebra Curry',
    ])
  })

  it('sets error state when cuisine fetch fails', async () => {
    fetchMealsByArea.mockRejectedValue(new Error('Network down'))

    const store = useRecipesStore()
    await store.loadCuisine('Italian')

    expect(store.cuisineStatus.Italian).toBe('error')
    expect(store.cuisineStatus['Italian:message']).toBe('Network down')
  })

  it('runSearch stores sorted results by name', async () => {
    searchMealsByName.mockResolvedValue([
      { idMeal: '2', strMeal: 'Yorkshire Pudding' },
      { idMeal: '1', strMeal: 'Chicken Pie' },
    ])

    const store = useRecipesStore()
    await store.runSearch('chicken', 'name')

    expect(store.searchStatus).toBe('success')
    expect(store.searchMode).toBe('name')
    expect(store.searchResults[0].strMeal).toBe('Chicken Pie')
    expect(searchMealsByName).toHaveBeenCalledWith('chicken')
  })

  it('runSearch loads a single meal by id', async () => {
    const meal = { idMeal: '52772', strMeal: 'Honey Teriyaki Salmon' }
    fetchMealById.mockResolvedValue(meal)

    const store = useRecipesStore()
    await store.runSearch('52772', 'id')

    expect(store.searchStatus).toBe('success')
    expect(store.searchResults).toEqual([meal])
    expect(fetchMealById).toHaveBeenCalledWith('52772')
  })

  it('runSearch loads all meals for a selected area when dish filter is empty', async () => {
    fetchMealsByArea.mockResolvedValue([
      { idMeal: '2', strMeal: 'Pizza' },
      { idMeal: '1', strMeal: 'Pasta' },
    ])

    const store = useRecipesStore()
    await store.runSearch('', 'area', 'Italian')

    expect(store.searchStatus).toBe('success')
    expect(store.searchArea).toBe('Italian')
    expect(store.searchResults).toHaveLength(2)
    expect(fetchMealsByArea).toHaveBeenCalledWith('Italian')
  })

  it('runSearch filters area meals by dish name', async () => {
    fetchMealsByArea.mockResolvedValue([
      { idMeal: '2', strMeal: 'Pizza' },
      { idMeal: '1', strMeal: 'Pasta' },
    ])

    const store = useRecipesStore()
    await store.runSearch('pizza', 'area', 'Italian')

    expect(store.searchResults).toHaveLength(1)
    expect(store.searchResults[0].strMeal).toBe('Pizza')
  })

  it('loadMealDetail caches successful lookups', async () => {
    const meal = { idMeal: '42', strMeal: 'Test Meal' }
    fetchMealById.mockResolvedValue(meal)

    const store = useRecipesStore()
    const first = await store.loadMealDetail('42')
    const second = await store.loadMealDetail('42')

    expect(first).toEqual(meal)
    expect(second).toEqual(meal)
    expect(fetchMealById).toHaveBeenCalledTimes(1)
  })
})
