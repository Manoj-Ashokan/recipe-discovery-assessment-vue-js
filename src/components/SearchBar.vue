<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecipesStore } from '@/stores/recipes.js'
import { normalizeSearchMode } from '@/utils/searchHelpers.js'

const router = useRouter()
const route = useRoute()
const store = useRecipesStore()

const localQuery = ref(store.searchQuery)
const localMode = ref(store.searchMode)
const localArea = ref(store.searchArea)

watch(
  () => store.searchQuery,
  (value) => {
    localQuery.value = value
  },
)

watch(
  () => store.searchMode,
  (value) => {
    localMode.value = value
  },
)

watch(
  () => store.searchArea,
  (value) => {
    localArea.value = value
  },
)

watch(localMode, (mode) => {
  if (normalizeSearchMode(mode) === 'area') {
    store.loadAreas()
  }
}, { immediate: true })

function buildRouteQuery({ query, mode, area }) {
  const params = { type: normalizeSearchMode(mode) }
  if (query) params.q = query
  if (normalizeSearchMode(mode) === 'area' && area) params.area = area
  return params
}

function submitSearch() {
  const mode = normalizeSearchMode(localMode.value)
  const query = localQuery.value.trim()
  const area = localArea.value.trim()

  if (mode === 'area') {
    if (!area) return
  } else if (!query) {
    return
  }

  const nextQuery = buildRouteQuery({ query, mode, area })

  if (route.name !== 'search') {
    router.push({ name: 'search', query: nextQuery })
  } else {
    store.runSearch(query, mode, area)
    router.replace({ name: 'search', query: nextQuery })
  }
}
</script>

<template>
  <form class="search" role="search" @submit.prevent="submitSearch">
    <div class="search__controls">
      <label class="visually-hidden" for="recipe-search-type">Search by</label>
      <select id="recipe-search-type" v-model="localMode" class="search__type" aria-label="Search by">
        <option value="name">Name</option>
        <option value="id">Recipe ID</option>
        <option value="area">Cuisine area</option>
      </select>

      <template v-if="localMode === 'area'">
        <label class="visually-hidden" for="recipe-search-area">Cuisine area</label>
        <select
          id="recipe-search-area"
          v-model="localArea"
          class="search__area"
          aria-label="Select cuisine area"
          :disabled="store.areasStatus === 'loading'"
        >
          <option disabled value="">Select area</option>
          <option v-for="area in store.areas" :key="area" :value="area">
            {{ area }}
          </option>
        </select>
      </template>

      <label class="visually-hidden" for="recipe-search">Search term</label>
      <input
        id="recipe-search"
        v-model="localQuery"
        type="search"
        name="q"
        autocomplete="off"
        :placeholder="
          localMode === 'id'
            ? 'e.g. 52772'
            : localMode === 'area'
              ? 'Filter dishes (optional)…'
              : 'Search recipes…'
        "
        enterkeyhint="search"
      />
    </div>
    <button type="submit" aria-label="Search recipes">Search</button>
  </form>
</template>

<style scoped>
.search {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  align-items: stretch;
}

.search__controls {
  display: flex;
  flex: 1;
  min-width: 0;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.search__type,
.search__area {
  flex: 0 0 auto;
  max-width: 9rem;
  padding: 0.65rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-elevated);
  color: var(--text);
  font: inherit;
}

.search__area {
  max-width: 10rem;
}

.search__type:focus-visible,
.search__area:focus-visible,
.search input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.search input {
  flex: 1 1 140px;
  min-width: 0;
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-elevated);
  color: var(--text);
  font: inherit;
}

.search button {
  padding: 0.65rem 1rem;
  border-radius: 999px;
  border: none;
  background: var(--accent);
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.search button:hover {
  background: var(--accent-strong);
}

.search button:focus-visible {
  outline: 2px solid var(--accent-strong);
  outline-offset: 2px;
}

@media (max-width: 640px) {
  .search {
    flex-direction: column;
  }

  .search__type,
  .search__area {
    max-width: none;
    flex: 1 1 100%;
  }
}
</style>
