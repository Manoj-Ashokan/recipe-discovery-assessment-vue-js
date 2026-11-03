import { describe, expect, it } from 'vitest'
import {
  filterMealsByDishQuery,
  isValidMealId,
  normalizeSearchMode,
  resolveAreaName,
  searchModeLabel,
} from './searchHelpers.js'

describe('searchHelpers', () => {
  it('normalizes search mode', () => {
    expect(normalizeSearchMode('id')).toBe('id')
    expect(normalizeSearchMode('invalid')).toBe('name')
  })

  it('validates meal ids', () => {
    expect(isValidMealId('52772')).toBe(true)
    expect(isValidMealId('52a')).toBe(false)
  })

  it('resolves featured cuisine names case-insensitively', () => {
    expect(resolveAreaName('indian')).toBe('Indian')
    expect(resolveAreaName('BRITISH')).toBe('British')
  })

  it('title-cases unknown area queries', () => {
    expect(resolveAreaName('french')).toBe('French')
  })

  it('returns human-readable mode labels', () => {
    expect(searchModeLabel('area')).toBe('cuisine area')
  })

  it('filters meals by dish name when query provided', () => {
    const meals = [
      { idMeal: '1', strMeal: 'Chicken Curry' },
      { idMeal: '2', strMeal: 'Beef Stew' },
    ]

    expect(filterMealsByDishQuery(meals, 'chicken')).toHaveLength(1)
    expect(filterMealsByDishQuery(meals, '')).toHaveLength(2)
  })
})
