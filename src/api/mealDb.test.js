import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchMealById,
  fetchMealsByArea,
  searchMealsByName,
  MealDbError,
} from './mealDb.js'

describe('mealDb API client', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('fetchMealsByArea returns meals array', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ meals: [{ idMeal: '1', strMeal: 'Test' }] }),
      }),
    )

    const meals = await fetchMealsByArea('Indian')
    expect(meals).toHaveLength(1)
    expect(fetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian',
    )
  })

  it('searchMealsByName returns empty array for blank query', async () => {
    vi.stubGlobal('fetch', vi.fn())
    const meals = await searchMealsByName('   ')
    expect(meals).toEqual([])
    expect(fetch).not.toHaveBeenCalled()
  })

  it('fetchMealById returns null when meal missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ meals: null }),
      }),
    )

    const meal = await fetchMealById('999')
    expect(meal).toBeNull()
  })

  it('throws MealDbError when network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(fetchMealsByArea('Italian')).rejects.toBeInstanceOf(MealDbError)
  })
})
