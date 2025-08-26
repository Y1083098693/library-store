<template>
  <div class="bg-white min-h-screen">
    <!-- 顶部导航 -->
    <div class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <router-link to="/" class="text-primary font-bold flex items-center">
          <i class="fa fa-arrow-left mr-2"></i>
          <span>返回</span>
        </router-link>
        <div class="flex items-center space-x-4">
          <button class="text-gray-600 hover:text-primary">
            <i class="fa fa-heart-o text-lg"></i>
          </button>
          <button class="text-gray-600 hover:text-primary">
            <i class="fa fa-share-alt text-lg"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 书本主要内容 -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- 书本封面 -->
        <div class="w-full md:w-1/3 lg:w-1/4">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm aspect-[3/4] relative">
            <img :src="book.cover_image" :alt="book.title" class="w-full h-full object-cover" />
            <div
              v-if="book.badge"
              class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded"
            >
              {{ book.badge }}
            </div>
          </div>
        </div>

        <!-- 书本信息 -->
        <div class="w-full md:w-2/3 lg:w-3/4">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ book.title }}</h1>
          <p class="text-gray-500 mb-4">{{ book.author }}</p>

          <div class="flex items-center mb-4">
            <div class="text-yellow-400 text-sm mr-2">
              <i v-for="star in 5" :key="star" :class="getStarClass(star, book.rating || 0)"></i>
            </div>
            <span class="text-gray-500 text-sm">({{ book.reviews || 0 }}条评价)</span>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex items-end mb-2">
              <span class="text-primary font-bold text-2xl mr-2"
                >¥{{ formatPrice(book.price) }}</span
              >
              <span v-if="book.originalPrice" class="text-gray-400 text-sm line-through">
                ¥{{ formatPrice(book.originalPrice) }}
              </span>
            </div>
            <div v-if="book.discount" class="text-red-500 text-sm">
              限时{{ Math.round(book.discount) }}%折扣
            </div>
          </div>

          <!-- 购买按钮 -->
          <div class="flex space-x-4 mb-8">
            <button
              class="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
              @click="handleBuyNow"
            >
              立即购买
            </button>
            <button
              class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              @click="handleAddToCart"
            >
              <i class="fa fa-cart-plus text-lg"></i>
            </button>
          </div>

          <!-- 书本详情 -->
          <div class="border-t border-gray-100 pt-6">
            <h2 class="text-lg font-medium text-gray-800 mb-4">内容简介</h2>
            <p class="text-gray-600 leading-relaxed">{{ book.description || '暂无内容简介' }}</p>
          </div>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div class="border-t border-gray-100 mt-10 pt-8">
        <h2 class="text-xl font-bold text-gray-800 mb-6">相关推荐</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <BookCard
            v-for="book in relatedBooks"
            :key="book.id"
            :book="book"
            @click="goToDetail(book.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BookCard from '@/components/books/BookCard.vue'
import { getBookDetail, getRelatedBooks } from '@/services/bookService'

export default {
  name: 'BookDetail',
  components: {
    BookCard,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const book = ref({})
    const relatedBooks = ref([])
    const loading = ref(true)

    const fetchBookDetail = async () => {
      try {
        loading.value = true
        book.value = await getBookDetail(route.params.id)
        relatedBooks.value = await getRelatedBooks(route.params.id)
      } catch (error) {
        console.error('获取书本详情失败:', error)
      } finally {
        loading.value = false
      }
    }

    const getStarClass = (star, rating) => {
      const normalizedRating = parseFloat(rating) || 0
      if (star <= Math.floor(normalizedRating)) return 'fa-solid fa-star'
      if (star === Math.ceil(normalizedRating) && !Number.isInteger(normalizedRating)) {
        return 'fa-solid fa-star-half-alt'
      }
      return 'fa-regular fa-star'
    }

    const formatPrice = (price) => {
      const num = parseFloat(price || 0)
      return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)
    }

    const handleBuyNow = () => {
      router.push({ path: `/checkout/${book.value.id}` })
    }

    const handleAddToCart = () => {
      // 加入购物车逻辑
      console.log('加入购物车:', book.value.id)
    }

    const goToDetail = (id) => {
      router.push({ path: `/books/${id}` })
    }

    onMounted(() => {
      fetchBookDetail()
    })

    return {
      book,
      relatedBooks,
      loading,
      getStarClass,
      formatPrice,
      handleBuyNow,
      handleAddToCart,
      goToDetail,
    }
  },
}
</script>

<style scoped>
/* 响应式调整 */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
