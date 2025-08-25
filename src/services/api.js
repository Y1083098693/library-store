import axios from 'axios'
import { useRouter } from 'vue-router'

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 解决Vue Router在axios中使用的问题
const router = useRouter ? useRouter() : null

// 请求拦截器 - 确保token格式绝对正确
api.interceptors.request.use(
  (config) => {
    try {
      // 1. 从localStorage获取token
      const rawToken = localStorage.getItem('token')

      // 2. 严格清理token（保留JWT允许的所有字符）
      const cleanToken = rawToken ? rawToken.replace(/[^a-zA-Z0-9\-._~+/=]/g, '').trim() : null

      // 3. 严格按照Bearer格式设置（必须有空格）
      if (cleanToken) {
        config.headers.Authorization = `Bearer ${cleanToken}`
        console.log('📤 携带Token:', `Bearer ${cleanToken.substring(0, 10)}...`)
      } else {
        console.log('📤 未携带Token')
        delete config.headers.Authorization // 确保没有残留无效值
      }
    } catch (e) {
      console.error('❌ Token处理失败:', e)
      delete config.headers.Authorization
    }
    return config
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器 - 精准处理token错误
api.interceptors.response.use(
  (response) => {
    console.log('✅ API响应成功:', response.config.url, response.status)
    return response.data
  },
  (error) => {
    console.error('❌ API错误详情:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      responseData: error.response?.data,
    })

    // 只在明确是token无效且状态码为403时处理
    const isInvalidToken =
      error.response?.status === 403 && error.response?.data?.message === '无效的token'

    if (isInvalidToken) {
      console.log('🔒 检测到无效token，清除登录状态')
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // 通知其他组件认证状态变化
      window.dispatchEvent(
        new CustomEvent('authStateChanged', { detail: { authenticated: false } }),
      )

      // 跳转到登录页（保留当前页面作为重定向目标）
      if (router && router.currentRoute.value.path !== '/auth') {
        router.push({
          path: '/auth',
          query: { redirect: router.currentRoute.value.fullPath },
        })
      }
    }

    // 保留原始错误信息供调用者处理
    return Promise.reject({
      success: false,
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      originalError: error,
    })
  },
)

// 认证相关API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  forgotPassword: (username) => api.post('/auth/forgot-password', { username }),
  logout: () => api.post('/auth/logout'),
}

// 用户相关API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getOrders: (status = 'all') => api.get(`/users/orders?status=${status}`),
  getWishlist: () => api.get('/users/wishlist'),
  getAddresses: () => api.get('/users/addresses'),
  getStats: () => api.get('/users/stats'),
}
// 新增：轮播图相关API
export const carouselAPI = {
  // 获取所有轮播图数据（与后端接口对应）
  getCarousels: () => api.get('/carousels'),
}

export default api
