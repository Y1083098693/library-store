import api from './api' // 假设您有一个统一的API请求配置

export const bookService = {
  // 获取所有分类 (用于Header)
  async getCategories() {
    try {
      const response = await api.get('/categories') // 对应后端API端点
      return response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // 根据Slug获取单个分类信息 (用于Category页面标题和描述)
  async getCategoryBySlug(slug) {
    try {
      const response = await api.get(`/categories/slug/${slug}`) // 或 `/categories?slug=${slug}`
      // 假设返回的是数组，取第一个，或者后端直接返回对象
      return Array.isArray(response.data) ? response.data[0] : response.data
    } catch (error) {
      console.error(`Error fetching category with slug ${slug}:`, error)
      throw error
    }
  },

  // 根据分类ID获取图书
  async getBooksByCategory(categoryId) {
    try {
      const response = await api.get('/books', {
        // 对应后端API端点
        params: { category_id: categoryId }, // 传递查询参数
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching books for category ID ${categoryId}:`, error)
      throw error
    }
  },

  // 还可以添加其他方法，如搜索、获取图书详情等
  // async searchBooks(query) { ... },
  // async getBookById(id) { ... },
}

// 为了兼容性，也可以直接导出方法
export const getCategories = bookService.getCategories
export const getCategoryBySlug = bookService.getCategoryBySlug
export const getBooksByCategory = bookService.getBooksByCategory
