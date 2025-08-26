// src/config/index.js

// 配置对象 - 使用命名导出
export const config = {
  apiBaseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
  isDevelopment: import.meta.env.NODE_ENV === 'development',
}

// 头像URL处理函数 - 确保使用export导出
export const getAvatarUrl = (avatarPath) => {
  if (!avatarPath) return null

  // 如果是完整URL直接返回
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }

  // 相对路径处理
  if (avatarPath.startsWith('/')) {
    return `${config.apiBaseURL}${avatarPath}`
  }

  // 其他情况
  return `${config.apiBaseURL}/${avatarPath}`
}

// 图片URL处理函数 - 统一使用前端路径
// src/config/index.js
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn('图片路径为空')
    return '/uploads/default-cover.jpg'
  }

  // 已经是完整URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // 重要：处理相对路径
  if (imagePath.startsWith('uploads/')) {
    return `/${imagePath}` // 添加前导斜杠
  }

  if (imagePath.startsWith('/uploads/')) {
    return imagePath // 已有斜杠，直接返回
  }
  if (imagePath.startsWith('/')) {
    return imagePath // 直接使用绝对路径
  }
  // 默认处理
  return `/${imagePath}`
}

// 可选：默认导出（为了兼容性）
export default {
  config,
  getAvatarUrl,
  getImageUrl,
}
