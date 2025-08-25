import api from './api'

class AuthService {
  // 私有方法：设置认证头
  static #setAuthHeader(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  // 私有方法：验证字符串输入
  static #validateStringInput(value, fieldName) {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      throw new Error(`${fieldName}不能为空`)
    }
    return value.trim()
  }

  // 登录
  static async login(credentials) {
    try {
      // 验证输入
      const username = this.#validateStringInput(credentials?.username, '用户名')
      const password = this.#validateStringInput(credentials?.password, '密码')

      console.log('发送登录请求:', { username: '***' }) // 避免日志泄露密码

      const response = await api.post('/auth/login', { username, password })
      const responseData = response.data || response

      // 验证响应格式
      if (!responseData.token || !responseData.user) {
        throw new Error(`登录响应格式错误: 缺少token或用户信息`)
      }

      // 存储认证信息
      localStorage.setItem('token', responseData.token)
      localStorage.setItem('user', JSON.stringify(responseData.user))
      this.#setAuthHeader(responseData.token)

      return responseData
    } catch (error) {
      console.error('登录请求错误:', {
        message: error.message,
        status: error.response?.status,
      })

      let errorMessage = '登录失败，请稍后重试'

      if (!error.response) {
        errorMessage = '网络错误，无法连接到服务器'
      } else if (error.response.status === 401) {
        errorMessage = error.response.data?.message || '用户名或密码错误，请重新输入'
      } else if (error.response.status === 404) {
        errorMessage = '登录接口不存在，请检查系统配置'
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message
      } else {
        errorMessage = `登录失败 (状态码: ${error.response.status})`
      }

      throw new Error(errorMessage)
    }
  }

  // 注册
  static async register(userData) {
    try {
      // 验证输入
      const username = this.#validateStringInput(userData?.username, '用户名')
      const password = this.#validateStringInput(userData?.password, '密码')
      const email = this.#validateStringInput(userData?.email, '邮箱')

      // 简单的邮箱格式验证
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('请输入有效的邮箱地址')
      }

      // 密码强度验证
      if (password.length < 6) {
        throw new Error('密码长度不能少于6个字符')
      }

      console.log('发送注册请求:', { username, email })
      const response = await api.post('/auth/register', { username, password, email })
      const responseData = response.data || response

      if (!responseData.success && !responseData.token && !responseData.user) {
        throw new Error('注册响应格式不正确')
      }

      // 如果注册成功并返回token，存储认证信息
      if (responseData.token && responseData.user) {
        localStorage.setItem('token', responseData.token)
        localStorage.setItem('user', JSON.stringify(responseData.user))
        this.#setAuthHeader(responseData.token)
      }

      return responseData
    } catch (error) {
      console.error('注册请求错误:', {
        message: error.message,
        status: error.response?.status,
      })

      let message = '注册失败，请稍后重试'

      if (error.response) {
        if (error.response.status === 409) {
          message = '该用户名或邮箱已被注册，请更换'
        } else if (error.response.data?.message) {
          message = error.response.data.message
        }
      } else if (error.message) {
        message = error.message
      }

      throw new Error(message)
    }
  }

  // 获取用户信息
  static async getProfile() {
    try {
      // 获取并验证token
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('未找到登录信息，请重新登录')
      }

      // 设置请求头
      this.#setAuthHeader(token)

      const response = await api.get('/auth/profile')
      const data = response.data || response

      if (!data) {
        throw new Error('未获取到用户信息')
      }

      // 更新本地存储的用户信息
      localStorage.setItem('user', JSON.stringify(data))
      console.log('获取用户信息成功')
      return data
    } catch (error) {
      console.error('获取用户信息失败:', {
        message: error.message,
        status: error.response?.status,
      })

      // 处理401未授权错误
      if (error.response?.status === 401) {
        this.logout() // 自动登出
        throw new Error('登录已过期，请重新登录')
      }

      throw new Error(error.response?.data?.message || '获取用户信息失败，请重试')
    }
  }

  // 退出登录
  static async logout() {
    try {
      // 发送退出登录请求到后端
      await api.post('/auth/logout')
    } catch (error) {
      console.error('退出登录请求失败:', error)
      // 即使后端请求失败，也继续执行前端登出流程
    } finally {
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // 清除认证头
      this.#setAuthHeader(null)
      // 触发认证状态变化事件
      window.dispatchEvent(new CustomEvent('authStateChanged'))
    }
  }

  // 忘记密码
  static async forgotPassword(username) {
    try {
      // 验证输入
      const validatedUsername = this.#validateStringInput(username, '用户名')

      const response = await api.post('/auth/forgot-password', { username: validatedUsername })
      const data = response.data || response

      if (!data.success && !data.message) {
        throw new Error('重置密码响应格式不正确')
      }

      return data
    } catch (error) {
      console.error('忘记密码请求错误:', {
        message: error.message,
        status: error.response?.status,
      })

      const errorMsg = error.response?.data?.message || '发送重置链接失败，请检查用户名是否正确'
      throw new Error(errorMsg)
    }
  }

  // 新增：检查用户是否已登录
  static isLoggedIn() {
    const token = localStorage.getItem('token')
    return !!token
  }

  // 新增：获取当前登录用户
  static getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('解析用户信息失败:', error)
      localStorage.removeItem('user')
      return null
    }
  }
}

export default AuthService
