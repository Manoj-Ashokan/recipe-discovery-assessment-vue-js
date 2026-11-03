import { createRouter, createWebHistory } from 'vue-router'

const DashboardView = () => import('@/views/DashboardView.vue')
const RecipeDetailView = () => import('@/views/RecipeDetailView.vue')
const SearchView = () => import('@/views/SearchView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'Recipe Discovery' },
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { title: 'Search Recipes' },
    },
    {
      path: '/recipe/:id',
      name: 'recipe-detail',
      component: RecipeDetailView,
      props: true,
      meta: { title: 'Recipe Details' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'Recipe Discovery'
  document.title = to.meta.title ? `${to.meta.title} · ${base}` : base
})

export default router
