<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <AppHeader />
    <main id="main-content" class="app-main" tabindex="-1">
      <RouterView />
    </main>
    <footer class="app-footer">
      <p>
        Data from
        <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer">
          TheMealDB
        </a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--layout-max);
  margin: 0 auto;
  padding: 1.25rem 1.25rem 3rem;
}

@media (min-width: 768px) {
  .app-main {
    padding: 1.5rem 2rem 4rem;
  }
}

.app-footer {
  border-top: 1px solid var(--border);
  padding: 1rem 1.25rem 1.5rem;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.app-footer p {
  margin: 0;
}

.app-footer a {
  color: var(--accent-strong);
}
</style>
