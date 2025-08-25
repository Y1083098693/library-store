import api from './api'

const userService = {
  // 获取用户资料 - 包含账号和昵称，并存储到本地
  getProfile: async function () {
    try {
      const response = await api.get('/users/profile')
      const userData = response.data

      // 确保获取到完整的用户信息
      if (!userData || typeof userData !== 'object') {
        throw new Error('未获取到有效的用户信息')
      }

      // 验证关键用户信息字段是否存在
      const requiredFields = ['id', 'account', 'nickname'] // 根据实际需求调整必填字段
      const missingFields = requiredFields.filter((field) => !(field in userData))

      if (missingFields.length > 0) {
        console.warn(`用户信息缺少以下字段: ${missingFields.join(', ')}`)
        // 仍然存储，但记录警告
      }

      // 存储完整用户信息到本地存储
      localStorage.setItem('completeUserInfo', JSON.stringify(userData))
      console.log('用户信息已存储到本地:', userData)

      return userData
    } catch (error) {
      console.error('获取用户资料失败:', error)
      throw new Error('获取用户资料失败: ' + error.message)
    }
  },

  // 从本地存储获取完整用户信息
  getStoredProfile: function () {
    try {
      const storedData = localStorage.getItem('completeUserInfo')
      if (storedData) {
        return JSON.parse(storedData)
      }
      return null
    } catch (error) {
      console.error('从本地存储获取用户信息失败:', error)
      // 清除损坏的存储数据
      localStorage.removeItem('completeUserInfo')
      return null
    }
  },

  // 更新用户资料 - 同时更新本地存储
  updateProfile: async function (userData) {
    try {
      const response = await api.put('/users/profile', userData)
      const updatedData = response.data || response

      // 更新成功后同步更新本地存储
      if (updatedData && typeof updatedData === 'object') {
        // 获取当前存储的完整信息
        const currentInfo = this.getStoredProfile() || {}
        // 合并更新后的数据，确保保留所有现有字段
        const mergedData = { ...currentInfo, ...updatedData }
        localStorage.setItem('completeUserInfo', JSON.stringify(mergedData))
        console.log('本地用户信息已更新')
      }

      return updatedData
    } catch (error) {
      console.error('更新个人资料API调用失败:', error)
      const errorMsg = error.response?.data?.message || '更新个人资料失败'
      throw new Error(errorMsg)
    }
  },

  // 其他方法保持不变...
  updateAvatar: async function (formData) {
    try {
      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      const result = response.data

      // 如果更新头像成功，同步更新本地存储
      if (result && result.avatar_url) {
        const currentInfo = this.getStoredProfile() || {}
        currentInfo.avatar_url = result.avatar_url
        localStorage.setItem('completeUserInfo', JSON.stringify(currentInfo))
        console.log('本地用户头像信息已更新')
      }

      return result
    } catch (error) {
      console.error('更新头像失败:', error)
      throw new Error('更新头像失败')
    }
  },

  clearStoredProfile: function () {
    localStorage.removeItem('completeUserInfo')
    console.log('本地用户信息已清除')
  },

  getOrders: async function (status = 'all') {
    try {
      const response = await api.get(`/users/orders?status=${status}`)
      return response.data
    } catch (error) {
      console.error('获取订单失败:', error)
      throw new Error('获取订单失败')
    }
  },

  getWishlist: async function () {
    try {
      const response = await api.get('/users/wishlist')
      return response.data
    } catch (error) {
      console.error('获取收藏失败:', error)
      throw new Error('获取收藏失败')
    }
  },

  getAddresses: async function () {
    try {
      const response = await api.get('/users/addresses')
      return response.data
    } catch (error) {
      console.error('获取地址失败:', error)
      throw new Error('获取地址失败')
    }
  },

  addAddress: async function (addressData) {
    try {
      const response = await api.post('/users/addresses', addressData)
      return response.data
    } catch (error) {
      console.error('添加地址失败:', error)
      throw new Error('添加地址失败')
    }
  },

  updateAddress: async function (id, addressData) {
    try {
      const response = await api.put(`/users/addresses/${id}`, addressData)
      return response.data
    } catch (error) {
      console.error('更新地址失败:', error)
      throw new Error('更新地址失败')
    }
  },

  deleteAddress: async function (id) {
    try {
      const response = await api.delete(`/users/addresses/${id}`)
      return response.data
    } catch (error) {
      console.error('删除地址失败:', error)
      throw new Error('删除地址失败')
    }
  },

  setDefaultAddress: async function (id) {
    try {
      const response = await api.post(`/users/addresses/${id}/default`)
      return response.data
    } catch (error) {
      console.error('设置默认地址失败:', error)
      throw new Error('设置默认地址失败')
    }
  },

  getStats: async function () {
    try {
      const response = await api.get('/users/stats')
      return response.data
    } catch (error) {
      console.error('获取统计数据失败:', error)
      throw new Error('获取统计数据失败')
    }
  },

  changePassword: async function (passwordData) {
    try {
      const response = await api.put('/users/password', passwordData)
      return response.data
    } catch (error) {
      console.error('修改密码失败:', error)
      throw new Error('修改密码失败')
    }
  },

  findById: async function (userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      const userData = response.data || response

      // 当通过ID获取用户信息时也存储到本地
      if (userData && typeof userData === 'object') {
        localStorage.setItem('completeUserInfo', JSON.stringify(userData))
        console.log('通过ID获取的用户信息已存储到本地')
      }

      return userData
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw new Error('获取用户信息失败')
    }
  },
}

export default userService
