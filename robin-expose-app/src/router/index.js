import { createRouter, createWebHistory } from 'vue-router'

const originComponents = import.meta.glob('../views/**/index.vue')
const originRoutes = import.meta.glob('../views/**/page.json', {
  eager: true,
  import: 'default'
})

const routes = Object.entries(originRoutes).map(([url, config]) => {
  const pageKey = url.replace('page.json', 'index.vue')
  const path = url.replace('/page.json', '').replace('../views/', '').split('/').join('-')
  return {
    ...config,
    path: `/${path}`,
    name: path,
    component: originComponents[pageKey]
  }
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
