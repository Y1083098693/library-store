<template>
  <div class="bg-white min-h-screen">
    <!-- 书本内容 -->
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- 封面图 -->
        <div class="w-full md:w-1/3 lg:w-1/4">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-sm aspect-[3/4] relative">
            <img
              :src="getImageUrl(book.cover_image)"
              :alt="book.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <!-- 折扣标签 -->
            <div
              v-if="book.discount > 0"
              class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              限时-{{ book.discount }}%折扣
            </div>
          </div>
        </div>

        <!-- 书本信息 -->
        <div class="w-full md:w-2/3 lg:w-3/4">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{{ book.title }}</h1>
          <p class="text-gray-500 mb-4">{{ book.author }}</p>

          <!-- 评分 -->
          <div class="flex items-center mb-4">
            <div class="text-yellow-400 text-sm mr-2">
              <i v-for="star in 5" :key="star" :class="getStarClass(star, book.rating)"></i>
            </div>
            <span class="text-gray-500 text-sm"> ({{ book.reviews || 0 }}条评价) </span>
          </div>

          <!-- 价格 -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex items-end mb-2">
              <span class="text-primary font-bold text-2xl mr-2">
                ¥{{ formatPrice(book.price) }}
              </span>
              <span
                v-if="
                  book.original_price && parseFloat(book.original_price) > parseFloat(book.price)
                "
                class="text-gray-400 text-sm line-through"
              >
                ¥{{ formatPrice(book.original_price) }}
              </span>
            </div>
            <div v-if="book.discount > 0" class="text-red-500 text-sm">
              限时-{{ book.discount }}%折扣
            </div>
          </div>

          <!-- 购买按钮 -->
          <div class="flex space-x-4 mb-8">
            <button
              class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              立即购买
            </button>
            <button
              class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
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
      <div
        v-if="book.related_books && book.related_books.length > 0"
        class="border-t border-gray-100 mt-10 pt-8"
      >
        <h2 class="text-xl font-bold text-gray-800 mb-6">相关推荐</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <BookCard
            v-for="relatedBook in book.related_books"
            :key="relatedBook.id"
            :book="relatedBook"
            @click="goToDetail(relatedBook.id)"
          />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from '@/components/layout/Footer.vue'
import BookCard from '@/components/books/BookCard.vue'
import { getBookDetail, getRelatedBooks } from '@/services/bookService'
import { config } from '@/config'

export default {
  components: { Footer, BookCard },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const book = ref({
      title: '',
      author: '',
      cover_image: '',
      price: 0,
      original_price: 0,
      rating: 0,
      reviews: 0,
      description: '',
      related_books: [],
    })

    // 价格格式化函数
    const formatPrice = (price) => {
      if (price === null || price === undefined) return '0.00'
      const num = typeof price === 'string' ? parseFloat(price) : price
      return isNaN(num) ? '0.00' : num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)
    }

    // 图片URL处理
    const getImageUrl = (imagePath) => {
      if (!imagePath) return '/images/default-book.jpg'
      if (imagePath.startsWith('http')) return imagePath
      return `${config.apiBaseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
    }

    // 图片加载错误处理
    const handleImageError = (event) => {
      event.target.src = '/images/default-book.jpg'
    }

    // 星级评分计算
    const getStarClass = (star, rating) => {
      const numRating = typeof rating === 'string' ? parseFloat(rating) : rating
      const normalizedRating = numRating || 0

      if (star <= Math.floor(normalizedRating)) return 'fa fa-star'
      if (star === Math.ceil(normalizedRating) && !Number.isInteger(normalizedRating)) {
        return 'fa fa-star-half-o'
      }
      return 'fa fa-star-o'
    }

    // 跳转到详情页
    const goToDetail = (id) => {
      router.push(`/books/${id}`)
    }

    // 加载书本详情数据
    const loadBookData = async () => {
      try {
        const bookData = await getBookDetail(route.params.id)
        console.log('📖 书本详情数据:', bookData)

        book.value = {
          ...bookData,
          price: bookData.selling_price || bookData.price || 0,
          original_price: bookData.original_price || 0,
          rating: parseFloat(bookData.rating) || 0,
          reviews: parseInt(bookData.review_count) || 0,
          cover_image: getImageUrl(bookData.cover_image),
        }

        // 数据验证
        console.group('📊 数据验证')
        console.log('价格字段:', {
          selling_price: bookData.selling_price,
          price: bookData.price,
          original_price: bookData.original_price,
        })
        console.log('数据类型:', {
          selling_price_type: typeof bookData.selling_price,
          price_type: typeof bookData.price,
        })
        console.groupEnd()
      } catch (error) {
        console.error('加载书本详情失败:', error)
      }
    }

    // 加载相关推荐数据
    const loadRelatedBooks = async () => {
      try {
        console.log('正在加载相关推荐...')
        const relatedData = await getRelatedBooks(route.params.id)
        console.log('相关推荐数据:', relatedData)

        // 根据API返回结构调整
        book.value.related_books = Array.isArray(relatedData)
          ? relatedData
          : Array.isArray(relatedData?.data)
            ? relatedData.data
            : []
      } catch (error) {
        console.error('加载相关推荐失败:', error)
        book.value.related_books = []
      }
    }

    // 组件挂载时加载数据
    onMounted(async () => {
      await loadBookData()
      await loadRelatedBooks()
    })

    return {
      book,
      formatPrice,
      getImageUrl,
      handleImageError,
      getStarClass,
      goToDetail,
    }
  },
}
</script>
