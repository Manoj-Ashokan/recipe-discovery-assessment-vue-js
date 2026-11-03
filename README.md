# Recipe Discovery Platform

A responsive Vue 3 application that browses recipes from [TheMealDB](https://www.themealdb.com/api.php) by cuisine, searches by name, and shows full recipe details.

## Environment

- **Node.js:** v22.23.2
- **npm:** 6.14.12

## Setup

```bash
npm install
npm run dev
```

Open the URL printed by Vite (typically `http://localhost:5173`).

### Other scripts

| Command | Description |
| --- | --- |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

## Features

- **Dashboard** — Responsive grid rows per cuisine (Indian, Italian, American, Chinese, British), sorted A→Z.
- **Recipe detail** — Ingredients, step-by-step instructions, image, tags, source, and YouTube link when available.
- **Search** — By **name**, **meal ID**, or **cuisine area** with an areas dropdown (TheMealDB `list.php?a=list`). Optional dish filter narrows area results; leave it empty to show all recipes for that area (`/search?type=area&area=Indian&q=curry`).
- **Loading & errors** — Per-section and per-page states with retry actions.
- **Accessibility** — Semantic landmarks, skip link, visible focus styles, labels, and keyboard-friendly navigation.

## Architecture

```
src/
  api/mealDb.js       # HTTP client + in-memory TTL cache (15 min)
  stores/recipes.js   # Pinia store (dashboard, detail, search state)
  router/index.js     # Vue Router routes
  components/         # Reusable UI (cards, rows, search, feedback)
  views/              # Route-level pages
  utils/              # Sorting, ingredient parsing, cache helper
```

### Data flow

1. **Dashboard mount** → Pinia `loadDashboard()` loads each featured area in parallel via `filter.php?a={Area}`.
2. **Responses** are cached in a small TTL map keyed by endpoint to avoid duplicate network calls when revisiting pages.
3. **Meals** are normalized in the store and sorted alphabetically before rendering.
4. **Detail view** loads `lookup.php?i={id}` once and keeps results in the store for back navigation.
5. **Search** uses `search.php?s={query}` and reuses the same sorting helper as the dashboard.

### Design choices

- **Minimal tooling:** Vite + Vue + Pinia + Vue Router only (no UI component library).
- **Composition API** throughout for colocated state and clarity.
- **No global CSS framework:** Custom tokens and layout for a lightweight, distinctive look.
- **Tests** focus on API client behavior, store logic, utilities, and a representative UI component.

## API reference

- Areas (used): `https://www.themealdb.com/api/json/v1/1/filter.php?a=Indian`
- Search: `https://www.themealdb.com/api/json/v1/1/search.php?s=chicken`
- Detail: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`
- Categories (available for future use): `https://www.themealdb.com/api/json/v1/1/categories.php`

## Performance

- **Lazy-loaded thumbnails** on dashboard/search grids (`loading="lazy"`, `fetchpriority="low"`, `decoding="async"`).
- **Priority hero image** on recipe detail (`fetchpriority="high"`) for faster LCP.
- **Fixed width/height + aspect-ratio** on cards to reduce layout shift (CLS).
- **`content-visibility: auto`** on dashboard cuisine sections to defer off-screen rendering work.
- **Route-level code splitting** for search and detail views.
- **Preconnect** to TheMealDB and Google Fonts from `index.html`.
- **API response caching** (15 minutes) to avoid duplicate meal list requests.

## Testing

Tests live next to the code as `*.test.js` files and run with Vitest + `@vue/test-utils` + `jsdom`.

```bash
npm test
```

Coverage includes sorting, ingredient parsing, cache TTL, API error handling, Pinia store flows, and `RecipeCard` rendering.
