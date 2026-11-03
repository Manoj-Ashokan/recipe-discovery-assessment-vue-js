import { describe, expect, it } from 'vitest'
import { parseIngredients } from './mealHelpers.js'

describe('parseIngredients', () => {
  it('extracts non-empty ingredient and measure pairs', () => {
    const meal = {
      strIngredient1: 'Chicken',
      strMeasure1: '500g',
      strIngredient2: 'Salt',
      strMeasure2: ' ',
      strIngredient3: '',
      strIngredient4: 'Pepper',
      strMeasure4: '1 tsp',
    }

    expect(parseIngredients(meal)).toEqual([
      { ingredient: 'Chicken', measure: '500g' },
      { ingredient: 'Salt', measure: '' },
      { ingredient: 'Pepper', measure: '1 tsp' },
    ])
  })

  it('returns empty list when meal is missing', () => {
    expect(parseIngredients(null)).toEqual([])
  })
})
