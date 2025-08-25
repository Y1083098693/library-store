import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [], // 收藏列表
    isLoading: false, // 加载状态
    error: null, // 错误信息
  }),

  getters: {
    // 获取收藏总数
    totalItems: (state) => state.items.length,

    // 检查商品是否已收藏
    isItemInWishlist: (state) => (id) => {
      return state.items.some((item) => item.id === id)
    },
  },

  actions: {
    // 添加到收藏
    addItem(item) {
      // 检查是否已收藏
      if (!this.isItemInWishlist(item.id)) {
        this.items.push(item)
        // 保存到本地存储
        this.saveToLocalStorage()
      }
    },

    // 从收藏中移除
    removeItem(id) {
      this.items = this.items.filter((item) => item.id !== id)
      // 保存到本地存储
      this.saveToLocalStorage()
    },

    // 清空收藏
    clearWishlist() {
      this.items = []
      this.saveToLocalStorage()
    },

    // 从本地存储加载
    loadFromLocalStorage() {
      this.isLoading = true
      try {
        const saved = localStorage.getItem('wishlistItems')
        if (saved) {
          this.items = JSON.parse(saved)
        }
        this.error = null
      } catch (err) {
        this.error = '加载收藏列表失败'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        localStorage.setItem('wishlistItems', JSON.stringify(this.items))
      } catch (err) {
        this.error = '保存收藏列表失败'
        console.error(err)
      }
    },
  },
})
