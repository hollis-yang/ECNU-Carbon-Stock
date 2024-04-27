import { createRouter, createWebHistory } from 'vue-router'
import CesiumMain from '../components/CesiumMain/index.vue'
import Screen from '../components/Screen/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: CesiumMain
    },
    {
      path: '/screen',
      component: Screen
    }
  ],
  // 路由行为配置项：每次切换路由回到页面顶部
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

export default router
