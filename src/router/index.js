import { createRouter, createWebHistory } from 'vue-router'

// 使用動態導入
const Home = () => import('../views/Home.vue')
const Detail = () => import('../views/Detail.vue')
// ... 其他頁面的動態導入

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
  // ... 其他路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
