<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useRecipesStore } from '@/stores/recipes.js'
import { parseIngredients } from '@/utils/mealHelpers.js'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import MealImage from '@/components/MealImage.vue'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const store = useRecipesStore()
const { mealDetails, mealDetailStatus } = storeToRefs(store)

const meal = computed(() => mealDetails.value[props.id] ?? null)
const status = computed(() => mealDetailStatus.value[props.id] ?? 'idle')
const errorMessage = computed(() => mealDetailStatus.value[`${props.id}:message`] ?? '')

const ingredients = computed(() => parseIngredients(meal.value))

const instructions = computed(() => {
  const text = meal.value?.strInstructions?.trim()
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
})

async function load() {
  await store.loadMealDetail(props.id)
}

onMounted(load)

watch(
  () => props.id,
  () => load(),
)
</script>

<template>
  <div class="detail">
    <nav aria-label="Breadcrumb">
      <RouterLink to="/" class="detail__back">← Back to dashboard</RouterLink>
    </nav>

    <LoadingSpinner v-if="status === 'loading'" size="lg" label="Loading recipe" />

    <ErrorMessage
      v-else-if="status === 'error'"
      title="Recipe unavailable"
      :message="errorMessage"
      @retry="load"
    />

    <article v-else-if="meal" class="detail__article">
      <div class="detail__hero">
        <MealImage
          class="detail__image"
          :src="meal.strMealThumb"
          :alt="`${meal.strMeal} prepared dish`"
          width="640"
          height="640"
          priority="high"
          sizes="(min-width: 900px) 420px, 100vw"
        />
        <div class="detail__intro">
          <p class="detail__area">{{ meal.strArea }} cuisine</p>
          <h1 class="detail__title">{{ meal.strMeal }}</h1>
          <dl class="detail__meta">
            <div v-if="meal.strCategory">
              <dt>Category</dt>
              <dd>{{ meal.strCategory }}</dd>
            </div>
            <div v-if="meal.strTags">
              <dt>Tags</dt>
              <dd>{{ meal.strTags.split(',').join(', ') }}</dd>
            </div>
            <div v-if="meal.strSource">
              <dt>Source</dt>
              <dd>
                <a :href="meal.strSource" target="_blank" rel="noopener noreferrer">
                  Original recipe
                </a>
              </dd>
            </div>
            <div v-if="meal.strYoutube">
              <dt>Video</dt>
              <dd>
                <a :href="meal.strYoutube" target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div class="detail__panels">
        <section aria-labelledby="ingredients-heading">
          <h2 id="ingredients-heading">Ingredients</h2>
          <ul class="detail__ingredients">
            <li v-for="(item, index) in ingredients" :key="`${item.ingredient}-${index}`">
              <span class="detail__measure">{{ item.measure }}</span>
              {{ item.ingredient }}
            </li>
          </ul>
        </section>

        <section aria-labelledby="instructions-heading">
          <h2 id="instructions-heading">Instructions</h2>
          <ol v-if="instructions.length > 1" class="detail__steps">
            <li v-for="(step, index) in instructions" :key="index">{{ step }}</li>
          </ol>
          <p v-else class="detail__instructions">{{ meal.strInstructions }}</p>
        </section>
      </div>
    </article>
  </div>
</template>

<style scoped>
.detail {
  display: grid;
  gap: 1.25rem;
}

.detail__back {
  color: var(--accent-strong);
  text-decoration: none;
  font-weight: 600;
}

.detail__back:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.detail__article {
  display: grid;
  gap: 2rem;
}

.detail__hero {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .detail__hero {
    grid-template-columns: minmax(280px, 420px) 1fr;
    align-items: start;
  }
}

.detail__image {
  width: 100%;
  border-radius: var(--radius-lg);
  aspect-ratio: 1;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.detail__image :deep(.meal-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__area {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-strong);
}

.detail__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  line-height: 1.15;
}

.detail__meta {
  margin: 1rem 0 0;
  display: grid;
  gap: 0.65rem;
}

.detail__meta dt {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.detail__meta dd {
  margin: 0.15rem 0 0;
}

.detail__meta a {
  color: var(--accent-strong);
}

.detail__panels {
  display: grid;
  gap: 1.75rem;
}

@media (min-width: 900px) {
  .detail__panels {
    grid-template-columns: 1fr 1.4fr;
    gap: 2rem;
  }
}

.detail__panels h2 {
  margin: 0 0 0.85rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
}

.detail__ingredients {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.55rem;
}

.detail__ingredients li {
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-md);
  background: var(--surface-elevated);
  border: 1px solid var(--border);
}

.detail__measure {
  display: inline-block;
  min-width: 4.5rem;
  margin-right: 0.35rem;
  font-weight: 600;
  color: var(--text-muted);
}

.detail__steps,
.detail__instructions {
  margin: 0;
  line-height: 1.65;
  color: var(--text);
}

.detail__steps {
  padding-left: 1.25rem;
  display: grid;
  gap: 0.75rem;
}
</style>
