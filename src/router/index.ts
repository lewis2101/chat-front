import { createRouter, createWebHistory } from 'vue-router'
import {RouteRecordRaw} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: import('@/pages/Login/index.vue')
  },
  {
    path: '/main/:user/:room',
    component: import('@/pages/Main/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
