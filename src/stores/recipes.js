import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  FEATURED_CUISINES,
  fetchAreas,
  fetchMealById,
  fetchMealsByArea,
  searchMealsByName,
} from '@/api/mealDb.js'
import { sortMealsAlphabetically } from '@/utils/sortMeals.js'
import {
  filterMealsByDishQuery,
  isValidMealId,
  normalizeSearchMode,
} from '@/utils/searchHelpers.js'

export const useRecipesStore = defineStore('recipes', () => {
  const cuisines = ref([...FEATURED_CUISINES])
  const mealsByCuisine = ref({})
  const cuisineStatus = ref({})
  const mealDetails = ref({})
  const mealDetailStatus = ref({})

  const areas = ref([])
  const areasStatus = ref('idle')
  const areasError = ref(null)

  const searchQuery = ref('')
  const searchMode = ref('name')
  const searchArea = ref('')
  const searchResults = ref([])
  const searchStatus = ref('idle')
  const searchError = ref(null)

  const dashboardLoading = computed(() =>
    cuisines.value.some((c) => cuisineStatus.value[c] === 'loading'),
  )

  const dashboardError = computed(() => {
    const failed = cuisines.value.find((c) => cuisineStatus.value[c] === 'error')
    if (!failed) return null
    return cuisineStatus.value[`${failed}:message`] ?? 'Failed to load recipes.'
  })

  function setCuisineMeals(cuisine, meals) {
    mealsByCuisine.value = {
      ...mealsByCuisine.value,
      [cuisine]: sortMealsAlphabetically(meals),
    }
  }

  async function loadCuisine(cuisine, { force = false } = {}) {
    if (!force && mealsByCuisine.value[cuisine]?.length) {
      cuisineStatus.value[cuisine] = 'success'
      return
    }

    cuisineStatus.value = { ...cuisineStatus.value, [cuisine]: 'loading' }
    delete cuisineStatus.value[`${cuisine}:message`]

    try {
      const meals = await fetchMealsByArea(cuisine)
      setCuisineMeals(cuisine, meals)
      cuisineStatus.value[cuisine] = 'success'
    } catch (error) {
      cuisineStatus.value[cuisine] = 'error'
      cuisineStatus.value[`${cuisine}:message`] =
        error?.message ?? 'Something went wrong loading this cuisine.'
    }
  }

  async function loadDashboard() {
    await Promise.all(cuisines.value.map((cuisine) => loadCuisine(cuisine)))
  }

  async function loadMealDetail(id) {
    if (mealDetails.value[id]) {
      mealDetailStatus.value[id] = 'success'
      return mealDetails.value[id]
    }

    mealDetailStatus.value = { ...mealDetailStatus.value, [id]: 'loading' }
    delete mealDetailStatus.value[`${id}:message`]

    try {
      const meal = await fetchMealById(id)
      if (!meal) {
        throw new Error('Recipe not found.')
      }
      mealDetails.value = { ...mealDetails.value, [id]: meal }
      mealDetailStatus.value[id] = 'success'
      return meal
    } catch (error) {
      mealDetailStatus.value[id] = 'error'
      mealDetailStatus.value[`${id}:message`] =
        error?.message ?? 'Unable to load recipe details.'
      return null
    }
  }

  async function loadAreas({ force = false } = {}) {
    if (!force && areas.value.length) {
      areasStatus.value = 'success'
      return
    }

    areasStatus.value = 'loading'
    areasError.value = null

    try {
      areas.value = await fetchAreas()
      areasStatus.value = 'success'
    } catch (error) {
      areas.value = []
      areasStatus.value = 'error'
      areasError.value = error?.message ?? 'Unable to load cuisine areas.'
    }
  }

  async function runSearch(query, mode = searchMode.value, area = searchArea.value) {
    const trimmed = query.trim()
    const resolvedMode = normalizeSearchMode(mode)
    const trimmedArea = area?.trim() ?? ''

    searchQuery.value = trimmed
    searchMode.value = resolvedMode
    searchArea.value = trimmedArea

    if (resolvedMode === 'area') {
      if (!trimmedArea) {
        searchResults.value = []
        searchStatus.value = 'error'
        searchError.value = 'Select a cuisine area from the list.'
        return
      }
    } else if (!trimmed) {
      searchResults.value = []
      searchStatus.value = 'idle'
      searchError.value = null
      return
    }

    searchStatus.value = 'loading'
    searchError.value = null

    try {
      let meals = []

      if (resolvedMode === 'id') {
        if (!isValidMealId(trimmed)) {
          searchResults.value = []
          searchStatus.value = 'error'
          searchError.value = 'Recipe ID must contain numbers only (e.g. 52772).'
          return
        }

        const meal = await fetchMealById(trimmed)
        meals = meal ? [meal] : []
      } else if (resolvedMode === 'area') {
        const areaMeals = await fetchMealsByArea(trimmedArea)
        meals = filterMealsByDishQuery(areaMeals, trimmed)
      } else {
        meals = await searchMealsByName(trimmed)
      }

      searchResults.value = sortMealsAlphabetically(meals)
      searchStatus.value = 'success'
    } catch (error) {
      searchResults.value = []
      searchStatus.value = 'error'
      searchError.value = error?.message ?? 'Search failed.'
    }
  }

  function clearSearch() {
    searchQuery.value = ''
    searchMode.value = 'name'
    searchArea.value = ''
    searchResults.value = []
    searchStatus.value = 'idle'
    searchError.value = null
  }

  return {
    cuisines,
    mealsByCuisine,
    cuisineStatus,
    mealDetails,
    mealDetailStatus,
    areas,
    areasStatus,
    areasError,
    searchQuery,
    searchMode,
    searchArea,
    searchResults,
    searchStatus,
    searchError,
    dashboardLoading,
    dashboardError,
    loadCuisine,
    loadDashboard,
    loadMealDetail,
    loadAreas,
    runSearch,
    clearSearch,
  }
})
