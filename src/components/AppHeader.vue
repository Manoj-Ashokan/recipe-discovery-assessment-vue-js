<script setup>
import { RouterLink } from 'vue-router'
import SearchBar from '@/components/SearchBar.vue'

defineProps({
  showSearch: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/" class="brand" aria-label="Recipe Discovery home">
        <span class="brand__mark" aria-hidden="true">🍽</span>
        <span class="brand__text">
          <span class="brand__title">Recipe Discovery</span>
          <span class="brand__tagline">Explore world cuisines</span>
        </span>
      </RouterLink>

      <nav class="nav" aria-label="Main">
        <RouterLink to="/" class="nav__link">Dashboard</RouterLink>
        <RouterLink to="/search" class="nav__link">Search</RouterLink>
      </nav>

      <SearchBar v-if="showSearch" class="app-header__search" />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.app-header__inner {
  max-width: var(--layout-max);
  margin: 0 auto;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 768px) {
  .app-header__inner {
    grid-template-columns: auto 1fr auto;
    padding: 1rem 2rem;
  }

  .app-header__search {
    grid-column: 2;
    justify-self: center;
    width: min(420px, 100%);
  }

  .nav {
    grid-column: 3;
  }
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.brand__mark {
  font-size: 1.75rem;
  line-height: 1;
}

.brand__text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.brand__title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.brand__tagline {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav__link {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}

.nav__link:hover,
.nav__link:focus-visible {
  color: var(--text);
  background: var(--surface-elevated);
}

.nav__link.router-link-active {
  color: var(--accent-strong);
  background: var(--accent-soft);
}
</style>
