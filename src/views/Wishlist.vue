<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 移除这里的Header组件引用，避免重复渲染 -->

    <!-- 页面标题 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800">我的收藏</h1>
        <p class="text-gray-500 mt-1">您收藏的所有图书都在这里</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container mx-auto px-4 py-8 flex-grow">
      <!-- 空状态 -->
      <div v-if="wishlistItems.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="w-24 h-24 mx-auto mb-4 text-gray-300">
          <i class="fa fa-heart-o text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">您还没有收藏任何图书</h3>
        <p class="text-gray-500 mb-6">浏览图书并点击收藏按钮，将喜欢的图书保存在这里</p>
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
        >
          <i class="fa fa-book mr-2"></i> 浏览图书
        </router-link>
      </div>

      <!-- 收藏列表 -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="item in wishlistItems"
          :key="item.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
        >
          <div class="relative">
            <router-link to="/book/detail" class="block">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-56 object-cover transition-transform duration-500 hover:scale-105"
              />
            </router-link>
            <button
              @click="removeFromWishlist(item.id)"
              class="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white transition-colors"
              aria-label="取消收藏"
            >
              <i class="fa fa-heart"></i>
            </button>
          </div>
          <div class="p-4">
            <router-link to="/book/detail" class="hover:text-primary transition-colors block mb-1">
              <h3 class="font-medium text-gray-900 line-clamp-1">{{ item.title }}</h3>
            </router-link>
            <p class="text-gray-500 text-sm mt-1 line-clamp-1">{{ item.author }}</p>
            <div class="mt-2 flex items-center text-amber-500">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star-half-o"></i>
              <span class="text-gray-500 text-sm ml-1">({{ item.rating }})</span>
            </div>
            <div class="mt-3 flex justify-between items-center">
              <span class="text-primary font-bold">¥{{ item.price.toFixed(2) }}</span>
              <button
                @click="addToCart(item)"
                class="text-sm px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
              >
                <i class="fa fa-shopping-cart mr-1"></i> 加入购物车
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { showToast } from '@/utils/notification'
// 移除Header组件的导入
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'Wishlist',
  components: {
    // 移除Header组件的注册
    Footer,
  },
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()

    // 从状态管理获取收藏数据
    const wishlistItems = ref(wishlistStore.items)

    // 监听收藏数据变化
    wishlistStore.$subscribe((mutation, state) => {
      wishlistItems.value = state.items
    })

    // 从收藏中移除
    const removeFromWishlist = (id) => {
      wishlistStore.removeItem(id)
      showToast('已从收藏中移除')
    }

    // 添加到购物车
    const addToCart = (item) => {
      cartStore.addItem({
        id: item.id,
        title: item.title,
        author: item.author,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: 1,
      })
      showToast('已添加到购物车')
    }

    return {
      wishlistItems,
      removeFromWishlist,
      addToCart,
    }
  },
}
</script>

<style scoped>
/* 确保图片容器溢出隐藏 */
.relative {
  overflow: hidden;
}

/* 空状态响应式调整 */
@media (max-width: 640px) {
  .p-8 {
    padding: 4rem 2rem;
  }
}
</style>
