import api from './api'

export const bookService = {
  // 获取所有分类
  async getCategories() {
    try {
      const response = await api.get('/categories')
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('获取分类列表错误:', error)
      throw error
    }
  },

  // 根据分类ID获取图书（新版）
  async getBooksByCategory(categoryId, { page = 1, limit = 12, sort = 'recommended' } = {}) {
    try {
      const response = await api.get(`/books/category/${categoryId}`, {
        params: { page, limit, sort },
      })

      // 统一响应结构处理
      const responseData = response.data || {}

      return {
        books: Array.isArray(responseData.data)
          ? responseData.data
          : Array.isArray(responseData)
            ? responseData
            : [],
        pagination: responseData.pagination || {
          page: parseInt(page),
          limit: parseInt(limit),
          total: Array.isArray(responseData.data)
            ? responseData.data.length
            : Array.isArray(responseData)
              ? responseData.length
              : 0,
        },
      }
    } catch (error) {
      console.error(`获取分类[${categoryId}]图书错误:`, error)
      throw error
    }
  },

  // 其他方法保持不变...
  async getCategoryBySlug(slug) {
    try {
      const response = await api.get(`/categories/slug/${slug}`)
      return Array.isArray(response.data) ? response.data[0] : response.data
    } catch (error) {
      console.error(`获取分类[${slug}]错误:`, error)
      throw error
    }
  },

  // 搜索图书（示例）
  async searchBooks(query, { page = 1, limit = 10 } = {}) {
    try {
      const response = await api.get('/books/search', {
        params: { q: query, page, limit },
      })
      return {
        books: response.data?.data || [],
        pagination: response.data?.pagination || {
          page,
          limit,
          total: 0,
        },
      }
    } catch (error) {
      console.error('搜索图书错误:', error)
      throw error
    }
  },
}

// 兼容旧版导出方式
export const getCategories = bookService.getCategories
export const getBooksByCategory = bookService.getBooksByCategory
export const getCategoryBySlug = bookService.getCategoryBySlug
export const searchBooks = bookService.searchBooks
