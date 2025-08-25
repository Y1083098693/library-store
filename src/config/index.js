// src/config/index.js
export const config = {
  // Vite环境变量必须用VITE_前缀，而非VUE_APP_
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
  isDevelopment: import.meta.env.NODE_ENV === 'development',
}

// 头像URL处理函数
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null

  if (avatarPath.startsWith('http')) {
    return avatarPath
  }

  // 相对路径，添加API基础URL
  if (avatarPath.startsWith('/')) {
    return `${config.apiBaseURL}${avatarPath}`
  }

  return avatarPath
}

// 统一的图片URL处理函数 - 适配轮播图图片路径
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null

  // 如果是完整URL，直接返回
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // 轮播图图片通常存储在后端uploads或static目录
  if (imagePath.startsWith('/')) {
    // 优先使用API地址拼接（后端静态资源）
    return `${config.apiBaseURL}${imagePath}`
  }

  // 处理相对路径（如"carousel-1.jpg"）
  return `${config.apiBaseURL}/uploads/${imagePath}`
}
