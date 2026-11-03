<script setup>
defineProps({
  label: {
    type: String,
    default: 'Loading',
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
})
</script>

<template>
  <div class="spinner" :class="`spinner--${size}`" role="status" :aria-label="label">
    <span class="spinner__ring" aria-hidden="true"></span>
    <span class="spinner__text">{{ label }}</span>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--text-muted);
}

.spinner__ring {
  border-radius: 50%;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  animation: spin 0.75s linear infinite;
}

.spinner--sm .spinner__ring {
  width: 1rem;
  height: 1rem;
}

.spinner--md .spinner__ring {
  width: 1.35rem;
  height: 1.35rem;
}

.spinner--lg .spinner__ring {
  width: 2rem;
  height: 2rem;
}

.spinner__text {
  font-size: 0.95rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
