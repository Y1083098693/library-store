import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AuthPage from '@/views/AuthPage.vue'
import { useAuthStore } from '@/stores/auth'
import Wishlist from '@/views/Wishlist.vue'
import Cart from '@/views/Cart.vue'
import Category from '@/views/Category.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: Wishlist,
    meta: { title: '我的收藏 - 小白书城' },
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: '购物车 - 小白书城' },
  },
  {
    path: '/category/:category', // 改为category
    name: 'Category',
    component: Category,
    meta: { title: '图书分类 - 小白书城' },
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: { requiresGuest: true }, // 只有未登录用户才能访问
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }, // 需要登录才能访问
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 添加全局路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 仅在首次加载时初始化（from.path为空表示首次进入）
  if (from.path === '') {
    console.log('🆕 首次加载应用，初始化认证状态')
    authStore.initialize()
  }

  console.log('🛣️ 路由守卫: 从', from.path, '到', to.path)
  console.log('🔐 当前认证状态:', authStore.isAuthenticated)

  // 需要登录认证的路由
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('🚫 需要认证，但未登录，跳转到登录页')
      next({
        path: '/auth',
        query: { redirect: to.fullPath },
      })
    } else {
      // 已认证，允许访问
      console.log('✅ 已认证，允许访问')
      next()
    }
  }
  // 只能未登录用户访问的路由
  else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('✅ 已登录，跳转到首页')
    next('/')
  }
  // 正常放行
  else {
    console.log('➡️ 路由放行')
    next()
  }
})

export default router
