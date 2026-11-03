<script setup>
defineProps({
  title: {
    type: String,
    default: 'Something went wrong',
  },
  message: {
    type: String,
    required: true,
  },
  retryable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="error" role="alert">
    <p class="error__title">{{ title }}</p>
    <p class="error__message">{{ message }}</p>
    <button v-if="retryable" type="button" class="error__retry" @click="emit('retry')">
      Try again
    </button>
  </div>
</template>

<style scoped>
.error {
  padding: 1rem 1.15rem;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--danger) 12%, var(--surface-elevated));
  border: 1px solid color-mix(in srgb, var(--danger) 35%, transparent);
}

.error__title {
  margin: 0 0 0.35rem;
  font-weight: 600;
  color: var(--danger);
}

.error__message {
  margin: 0;
  color: var(--text);
  font-size: 0.95rem;
}

.error__retry {
  margin-top: 0.75rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface);
  font: inherit;
  cursor: pointer;
}

.error__retry:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
