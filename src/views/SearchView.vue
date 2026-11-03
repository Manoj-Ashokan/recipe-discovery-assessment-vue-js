<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecipesStore } from '@/stores/recipes.js'
import { normalizeSearchMode, searchModeLabel } from '@/utils/searchHelpers.js'
import RecipeCard from '@/components/RecipeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const route = useRoute()
const store = useRecipesStore()
const {
  searchQuery,
  searchMode,
  searchArea,
  searchResults,
  searchStatus,
  searchError,
} = storeToRefs(store)

const resultsSummary = computed(() => {
  if (searchMode.value !== 'area' || !searchArea.value) return ''

  if (searchQuery.value) {
    return `${searchArea.value} recipes matching “${searchQuery.value}”`
  }

  return `All ${searchArea.value} recipes`
})

function runFromRoute() {
  const q = typeof route.query.q === 'string' ? route.query.q : ''
  const type = normalizeSearchMode(typeof route.query.type === 'string' ? route.query.type : 'name')
  const area = typeof route.query.area === 'string' ? route.query.area : ''

  if (type === 'area') {
    store.loadAreas()
    if (area.trim()) {
      store.runSearch(q, type, area)
      return
    }
  }

  if (q.trim()) {
    store.runSearch(q, type, area)
    return
  }

  if (type === 'area') {
    store.searchQuery = ''
    store.searchMode = 'area'
    store.searchArea = ''
    store.searchResults = []
    store.searchStatus = 'idle'
    store.searchError = null
    return
  }

  store.clearSearch()
}

onMounted(runFromRoute)

watch(
  () => [route.query.q, route.query.type, route.query.area],
  () => runFromRoute(),
)
</script>

<template>
  <div class="search-page">
    <header class="search-page__header">
      <h1 class="search-page__title">Search recipes</h1>
      <p class="search-page__lead">
        <template v-if="searchMode === 'area' && searchArea">
          Showing <strong>{{ resultsSummary }}</strong>
        </template>
        <template v-else-if="searchQuery">
          Results for <strong>{{ searchQuery }}</strong>
          <span class="search-page__mode">({{ searchModeLabel(searchMode) }})</span>
        </template>
        <template v-else>
          Search by recipe name or ID. For cuisine area, pick an area and optionally filter
          dishes by name.
        </template>
      </p>
    </header>

    <LoadingSpinner v-if="searchStatus === 'loading'" size="lg" label="Searching recipes" />

    <ErrorMessage
      v-else-if="searchStatus === 'error'"
      :message="searchError"
      @retry="store.runSearch(searchQuery, searchMode, searchArea)"
    />

    <p
      v-else-if="searchStatus === 'success' && !searchResults.length"
      class="search-page__empty"
      role="status"
    >
      <template v-if="searchMode === 'area' && searchArea && searchQuery">
        No dishes in {{ searchArea }} matched “{{ searchQuery }}”.
      </template>
      <template v-else>
        No recipes matched your search. Try another {{ searchModeLabel(searchMode) }}.
      </template>
    </p>

    <ul v-else-if="searchResults.length" class="search-page__grid" role="list">
      <li v-for="meal in searchResults" :key="meal.idMeal" role="listitem">
        <RecipeCard :meal="meal" :cuisine="searchMode === 'area' ? searchArea : ''" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search-page {
  display: grid;
  gap: 1.5rem;
}

.search-page__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.search-page__lead {
  margin: 0.5rem 0 0;
  color: var(--text-muted);
}

.search-page__mode {
  color: var(--text-muted);
  font-weight: 500;
}

.search-page__empty {
  margin: 0;
  color: var(--text-muted);
}

.search-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.search-page__grid :deep(.card) {
  width: 100%;
}
</style>
