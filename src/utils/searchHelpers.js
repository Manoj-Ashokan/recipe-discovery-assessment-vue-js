import { FEATURED_CUISINES } from '@/api/mealDb.js'

export const SEARCH_MODES = ['name', 'id', 'area']

export function normalizeSearchMode(mode) {
  return SEARCH_MODES.includes(mode) ? mode : 'name'
}

export function isValidMealId(value) {
  return /^\d+$/.test(value.trim())
}

export function resolveAreaName(query) {
  const trimmed = query.trim()
  if (!trimmed) return null

  const featuredMatch = FEATURED_CUISINES.find(
    (area) => area.toLowerCase() === trimmed.toLowerCase(),
  )
  if (featuredMatch) return featuredMatch

  return trimmed.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function searchModeLabel(mode) {
  switch (normalizeSearchMode(mode)) {
    case 'id':
      return 'recipe ID'
    case 'area':
      return 'cuisine area'
    default:
      return 'recipe name'
  }
}

export function filterMealsByDishQuery(meals, query) {
  if (!meals?.length) return []
  const trimmed = query?.trim()
  if (!trimmed) return meals

  const needle = trimmed.toLowerCase()
  return meals.filter((meal) => meal.strMeal?.toLowerCase().includes(needle))
}
