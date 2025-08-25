import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    wishlist: [],
  }),

  getters: {
    cartItemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    cartTotal: (state) =>
      state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    wishlistItemCount: (state) => state.wishlist.length,
  },

  actions: {
    // 购物车相关操作
    addToCart(product, quantity = 1) {
      const existingItem = this.items.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        this.items.push({ ...product, quantity })
      }

      // 可以在这里添加本地存储逻辑
      this.saveCartToLocalStorage()
    },

    removeFromCart(productId) {
      this.items = this.items.filter((item) => item.id !== productId)
      this.saveCartToLocalStorage()
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find((item) => item.id === productId)
      if (item) {
        item.quantity = quantity
        this.saveCartToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveCartToLocalStorage()
    },

    // 愿望清单相关操作
    addToWishlist(product) {
      const existingItem = this.wishlist.find((item) => item.id === product.id)
      if (!existingItem) {
        this.wishlist.push(product)
        this.saveWishlistToLocalStorage()
      }
    },

    removeFromWishlist(productId) {
      this.wishlist = this.wishlist.filter((item) => item.id !== productId)
      this.saveWishlistToLocalStorage()
    },

    moveToCart(productId) {
      const product = this.wishlist.find((item) => item.id === productId)
      if (product) {
        this.addToCart(product)
        this.removeFromWishlist(productId)
      }
    },

    // 本地存储相关
    saveCartToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    saveWishlistToLocalStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist))
    },

    loadCartFromLocalStorage() {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
    },

    loadWishlistFromLocalStorage() {
      const savedWishlist = localStorage.getItem('wishlist')
      if (savedWishlist) {
        this.wishlist = JSON.parse(savedWishlist)
      }
    },
  },
})
