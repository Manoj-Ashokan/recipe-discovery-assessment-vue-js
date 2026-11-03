import { createCache } from '@/utils/cache.js'

export const MEAL_DB_BASE = 'https://www.themealdb.com/api/json/v1/1'
export const FEATURED_CUISINES = ['Indian', 'Algerian', 'Italian', 'American', 'Chinese', 'British']

const cache = createCache()

class MealDbError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message)
    this.name = 'MealDbError'
    this.status = status
    this.cause = cause
  }
}

async function fetchJson(path) {
  const url = `${MEAL_DB_BASE}${path}`
  let response
  try {
    response = await fetch(url)
  } catch (cause) {
    throw new MealDbError('Unable to reach the recipe service. Check your connection.', {
      cause,
    })
  }

  if (!response.ok) {
    throw new MealDbError(`Recipe service returned ${response.status}.`, {
      status: response.status,
    })
  }

  return response.json()
}

async function cachedFetch(key, path) {
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  const data = await fetchJson(path)
  cache.set(key, data)
  return data
}

export async function fetchMealsByArea(area) {
  const data = await cachedFetch(`area:${area}`, `/filter.php?a=${encodeURIComponent(area)}`)
  return data.meals ?? []
}

export async function searchMealsByName(query) {
  const trimmed = query.trim()
  if (!trimmed) return []

  const data = await cachedFetch(
    `search:${trimmed.toLowerCase()}`,
    `/search.php?s=${encodeURIComponent(trimmed)}`,
  )
  return data.meals ?? []
}

export async function fetchMealById(id) {
  const data = await cachedFetch(`meal:${id}`, `/lookup.php?i=${encodeURIComponent(id)}`)
  return data.meals?.[0] ?? null
}

export async function fetchCategories() {
  const data = await cachedFetch('categories', '/categories.php')
  return data.categories ?? []
}

export async function fetchAreas() {
  const data = await cachedFetch('areas-list', '/list.php?a=list')
  const areas = (data.meals ?? [])
    .map((item) => item.strArea)
    .filter(Boolean)

  return [...new Set(areas)].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}

export { MealDbError }
