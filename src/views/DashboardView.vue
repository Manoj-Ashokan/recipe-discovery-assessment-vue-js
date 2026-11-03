

<template>
  <div class="dashboard">
    <section class="hero" aria-labelledby="hero-heading">
      <p class="hero__eyebrow">TheMealDB · curated areas</p>
      <h1 id="hero-heading" class="hero__title">Find your next favorite dish</h1>
      <p class="hero__lead">
        Browse recipe collections by cuisine in a responsive grid. Every list is sorted
        alphabetically so you can see all dishes at a glance.
      </p>
    </section>

    <div v-if="dashboardLoading && !cuisines.some((c) => mealsByCuisine[c]?.length)" class="dashboard__loading">
      <LoadingSpinner size="lg" label="Loading recipe dashboard" />
    </div>

    <div class="dashboard__rows">
      <CuisineRow
        v-for="cuisine in cuisines"
        :key="cuisine"
        :cuisine="cuisine"
        :meals="mealsByCuisine[cuisine] ?? []"
        :status="cuisineStatus[cuisine] ?? 'idle'"
        :error-message="cuisineErrorMessage(cuisine)"
        @retry="retryCuisine(cuisine)"
      />
    </div>

    <ErrorMessage
      v-if="cuisines.every((c) => cuisineStatus[c] === 'error')"
      title="Dashboard unavailable"
      message="We couldn't load any cuisine sections. Check your connection and try again."
      @retry="store.loadDashboard()"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRecipesStore } from '@/stores/recipes.js'
import CuisineRow from '@/components/CuisineRow.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const store = useRecipesStore()
const { cuisines, mealsByCuisine, cuisineStatus, dashboardLoading } = storeToRefs(store)

onMounted(() => {
  store.loadDashboard()
})

function cuisineErrorMessage(cuisine) {
  return cuisineStatus.value[`${cuisine}:message`]
}

function retryCuisine(cuisine) {
  store.loadCuisine(cuisine, { force: true })
}
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 2rem;
}

.hero {
  padding: 0.5rem 0 0.25rem;
}

.hero__eyebrow {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.hero__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.85rem, 4vw, 2.75rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  max-width: 16ch;
}

.hero__lead {
  margin: 0.85rem 0 0;
  max-width: 52ch;
  color: var(--text-muted);
  line-height: 1.6;
}

.dashboard__loading {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
}

.dashboard__rows {
  display: grid;
  gap: 2.25rem;
}
</style>
