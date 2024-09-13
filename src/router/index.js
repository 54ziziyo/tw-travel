import { createRouter, createWebHistory } from 'vue-router'

// 使用動態導入
const Home = () => import('../views/Home.vue')
const Detail = () => import('../views/Detail.vue')
const Map = () => import('../views/Map.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:name',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/map',
    name: 'Map',
    component: Map
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
