<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  width: {
    type: [Number, String],
    default: 320,
  },
  height: {
    type: [Number, String],
    default: 320,
  },
  priority: {
    type: String,
    default: 'lazy',
    validator: (value) => ['lazy', 'high'].includes(value),
  },
  sizes: {
    type: String,
    default: '(min-width: 900px) 220px, (min-width: 640px) 25vw, 45vw',
  },
})

const failed = ref(false)

const loading = computed(() => (props.priority === 'high' ? 'eager' : 'lazy'))
const fetchPriority = computed(() => (props.priority === 'high' ? 'high' : 'low'))

function onError() {
  failed.value = true
}
</script>

<template>
  <img
    v-if="!failed && src"
    class="meal-image"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="loading"
    :fetchpriority="fetchPriority"
    decoding="async"
    :sizes="sizes"
    @error="onError"
  />
  <div v-else class="meal-image meal-image--fallback" role="img" :aria-label="alt">
    <span aria-hidden="true">🍽</span>
  </div>
</template>

<style scoped>
.meal-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meal-image--fallback {
  display: grid;
  place-items: center;
  background: var(--surface-muted);
  color: var(--text-muted);
  font-size: 2rem;
  aspect-ratio: 1;
}
</style>
