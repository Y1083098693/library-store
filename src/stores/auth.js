import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    initialized: false, // 标记是否已初始化
  }),

  actions: {
    // 初始化认证状态
    initialize() {
      if (this.initialized) return // 防止重复初始化

      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')

        console.log('🔄 初始化认证状态 - token存在:', !!token)
        console.log('🔄 初始化认证状态 - user存在:', !!userStr)

        if (token && userStr) {
          // 严格清理token
          const cleanToken = token.replace(/[^a-zA-Z0-9\-._~+/=]/g, '').trim()
          const user = JSON.parse(userStr)

          this.token = cleanToken
          this.user = user
          this.isAuthenticated = true

          // 设置全局Authorization头
          api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`
          console.log('✅ 认证状态初始化成功')
        } else {
          this.clearAuthState()
        }
      } catch (e) {
        console.error('❌ 初始化认证状态失败:', e)
        this.clearAuthState()
      } finally {
        this.initialized = true // 标记为已初始化
      }
    },

    // 验证token有效性
    async validateToken() {
      if (!this.token) return false

      try {
        console.log('🔐 验证token有效性')
        await api.get('/users/profile') // 使用用户信息接口验证
        console.log('✅ Token验证成功')
        return true
      } catch (error) {
        console.error('❌ Token验证失败:', error.message)
        // 只在明确是无效token时清除状态
        if (error.status === 403 && error.message === '无效的token') {
          this.clearAuthState()
        }
        return false
      }
    },

    // 登录
    async login(credentials) {
      if (this.loading) return

      try {
        this.loading = true
        console.log('🔐 处理登录请求')

        const response = await authAPI.login(credentials)
        console.log('所有信息：', response)
        const { token, user } = response

        // 验证后端返回的数据格式
        if (!token || typeof token !== 'string' || token.length < 20) {
          throw new Error('后端返回无效token')
        }
        if (!user || !user.id) {
          throw new Error('后端返回用户信息不完整')
        }

        // 清理并存储token
        const cleanToken = token.replace(/[^a-zA-Z0-9\-._~+/=]/g, '').trim()
        localStorage.setItem('token', cleanToken)
        localStorage.setItem('user', JSON.stringify(user))

        // 更新状态
        this.token = cleanToken
        this.user = user
        this.isAuthenticated = true
        api.defaults.headers.common['Authorization'] = `Bearer ${cleanToken}`

        console.log('🎉 登录成功，token已存储')
        return response
      } catch (error) {
        console.error('❌ 登录失败:', error.message)
        this.clearAuthState()
        throw error
      } finally {
        this.loading = false
      }
    },

    // 注册
    async register(userData) {
      if (this.loading) return

      try {
        this.loading = true
        const response = await authAPI.register(userData)
        const data = response.data || response
        return data
      } catch (error) {
        console.error('❌ 注册失败:', error.message)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 忘记密码
    async forgotPassword(username) {
      if (this.loading) return

      try {
        this.loading = true
        const response = await authAPI.forgotPassword(username)
        return response.data || response
      } catch (error) {
        console.error('❌ 忘记密码失败:', error.message)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取完整用户信息 - 修改为存储所有字段
    async fetchUserProfile() {
      if (!this.token || this.loading) return

      try {
        this.loading = true
        console.log('📋 获取完整用户信息')

        // 获取完整用户资料
        const response = await api.get('/users/profile')
        const userData = response.data || response

        // 验证返回数据的有效性
        if (!userData || !userData.id) {
          throw new Error('用户信息格式不正确')
        }

        // 存储完整的用户信息
        this.user = userData
        localStorage.setItem('user', JSON.stringify(userData))

        console.log('✅ 完整用户信息存储成功:', Object.keys(userData))
        console.log('📦 存储的用户数据:', JSON.stringify(userData, null, 2))

        return userData
      } catch (error) {
        console.error('❌ 获取用户信息失败:', error.message)

        // 处理无效token情况
        if (error.status === 403 && error.message === '无效的token') {
          console.log('🔒 检测到无效token，执行登出')
          this.logout()
        }

        throw error
      } finally {
        this.loading = false
      }
    },

    // 退出登录
    logout() {
      console.log('🚪 执行退出登录')
      delete api.defaults.headers.common['Authorization']
      this.clearAuthState()
    },

    // 清除认证状态
    clearAuthState() {
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      window.dispatchEvent(
        new CustomEvent('authStateChanged', { detail: { authenticated: false } }),
      )
    },

    // 更新用户信息
    updateUserInfo(newInfo) {
      if (this.user) {
        console.log('🔄 更新用户信息:', newInfo)
        // 合并新信息到现有用户对象
        this.user = { ...this.user, ...newInfo }
        localStorage.setItem('user', JSON.stringify(this.user))
        console.log('✅ 用户信息更新完成')
      }
    },
  },
})
