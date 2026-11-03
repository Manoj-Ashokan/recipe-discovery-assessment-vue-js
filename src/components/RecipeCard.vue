<script setup>
import { RouterLink } from 'vue-router'
import MealImage from '@/components/MealImage.vue'

defineProps({
  meal: {
    type: Object,
    required: true,
  },
  cuisine: {
    type: String,
    default: '',
  },
  layout: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'carousel'].includes(value),
  },
})
</script>

<template>
  <article class="card" :class="{ 'card--carousel': layout === 'carousel' }">
    <RouterLink
      :to="{ name: 'recipe-detail', params: { id: meal.idMeal } }"
      class="card__link"
    >
      <div class="card__media">
        <MealImage
          :src="meal.strMealThumb"
          :alt="`${meal.strMeal} dish`"
          width="320"
          height="320"
          priority="lazy"
        />
      </div>
      <div class="card__body">
        <h3 class="card__title">{{ meal.strMeal }}</h3>
        <p v-if="cuisine" class="card__meta">{{ cuisine }}</p>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.card {
  width: 100%;
}

.card--carousel {
  flex: 0 0 auto;
  width: min(220px, 72vw);
  scroll-snap-align: start;
}

.card__link {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
  background: var(--surface-elevated);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card__link:hover,
.card__link:focus-visible {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card__link:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.card__media {
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--surface-muted);
}

.card__body {
  padding: 0.85rem 1rem 1rem;
}

.card__title {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.35;
  font-weight: 600;
}

.card__meta {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
