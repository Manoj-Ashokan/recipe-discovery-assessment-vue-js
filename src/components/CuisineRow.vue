<script setup>
import { computed } from 'vue'
import RecipeCard from '@/components/RecipeCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const props = defineProps({
  cuisine: {
    type: String,
    required: true,
  },
  meals: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: 'idle',
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['retry'])

const listId = computed(() => `cuisine-${props.cuisine.toLowerCase()}-list`)
</script>

<template>
  <section class="row" :aria-labelledby="`${listId}-heading`">
    <div class="row__header">
      <h2 :id="`${listId}-heading`" class="row__title">{{ cuisine }}</h2>
      <p class="row__count" aria-live="polite">
        <template v-if="status === 'success'">{{ meals.length }} recipes</template>
      </p>
    </div>

    <LoadingSpinner v-if="status === 'loading'" label="Loading recipes" />

    <ErrorMessage
      v-else-if="status === 'error'"
      :message="errorMessage || 'Could not load recipes for this cuisine.'"
      @retry="emit('retry')"
    />

    <p v-else-if="status === 'success' && !meals.length" class="row__empty">
      No recipes found for this cuisine.
    </p>

    <ul v-else-if="meals.length" :id="listId" class="row__grid" role="list">
      <li v-for="meal in meals" :key="meal.idMeal" role="listitem">
        <RecipeCard :meal="meal" :cuisine="cuisine" layout="grid" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.row {
  display: grid;
  gap: 0.85rem;
  content-visibility: auto;
  contain-intrinsic-size: auto 420px;
}

.row__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.row__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  font-weight: 700;
}

.row__count {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.row__empty {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.row__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 200px), 1fr));
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.row__grid > li {
  margin: 0;
  min-width: 0;
}
</style>
