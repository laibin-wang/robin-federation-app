import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import {__federation_method_setRemote, __federation_method_getRemote, __federation_method_unwrapDefault} from 'virtual:__federation__'


__federation_method_setRemote('remote_app', {
  url: () => Promise.resolve('http://127.0.0.1:5500/assets/remoteEntry.js'),
  format: 'esm',
  from: 'vite',
})

const rote = ['system', 'system-add', 'user']

const res = []

for await(let value of rote){
    const moduleWraped = await __federation_method_getRemote('remote_app', `./${value}`)
    res.push({
        name:`${value.toLowerCase()}`,
        path:`/${value.toLowerCase()}`,
        component: () => __federation_method_unwrapDefault(moduleWraped)
    })
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ],
  ...res
})

export default router
