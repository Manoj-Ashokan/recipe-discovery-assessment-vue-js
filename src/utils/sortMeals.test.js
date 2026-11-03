import { describe, expect, it } from 'vitest'
import { sortMealsAlphabetically } from './sortMeals.js'

describe('sortMealsAlphabetically', () => {
  it('sorts meals by name case-insensitively', () => {
    const meals = [
      { idMeal: '1', strMeal: 'Ziti' },
      { idMeal: '2', strMeal: 'apple pie' },
      { idMeal: '3', strMeal: 'Banana Split' },
    ]

    const sorted = sortMealsAlphabetically(meals)
    expect(sorted.map((m) => m.strMeal)).toEqual(['apple pie', 'Banana Split', 'Ziti'])
  })

  it('returns empty array for invalid input', () => {
    expect(sortMealsAlphabetically(null)).toEqual([])
    expect(sortMealsAlphabetically([])).toEqual([])
  })
})
