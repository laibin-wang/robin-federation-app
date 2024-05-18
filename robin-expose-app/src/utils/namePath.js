const originComponents = import.meta.glob('../views/**/index.vue')
const originRoutes = import.meta.glob('../views/**/page.json', {
  eager: true,
  import: 'default'
})

export {
  originComponents,
  originRoutes
}