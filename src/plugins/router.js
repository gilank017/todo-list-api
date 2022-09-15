import { createRouter, createWebHistory } from 'vue-router'
import todoActivity from '../views/todo-activity.vue'

const routes = [
  {
    path: '/',
    name: 'Activity',
    component: todoActivity
  },
  {
    path: '/detail/:id',
    name: 'list',
    component: () => import('../views/todo-list.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
