<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 分类标题栏 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800">
          {{ categoryInfo?.name || '加载中...' }}
        </h1>
        <p class="text-gray-500 mt-1">{{ categoryInfo?.description || '探索精彩图书' }}</p>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 侧边筛选栏 -->
        <div class="w-full md:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-sm p-5 sticky top-24">
            <h2 class="font-semibold text-lg mb-4 pb-2 border-b border-gray-100">筛选条件</h2>

            <!-- 价格范围 -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-700 mb-3">价格范围</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="all"
                    v-model="priceFilter"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-600">全部价格</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="0-50"
                    v-model="priceFilter"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-600">¥0 - ¥50</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="50-100"
                    v-model="priceFilter"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-600">¥50 - ¥100</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    value="100+"
                    v-model="priceFilter"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-gray-600">¥100以上</span>
                </label>
              </div>
            </div>

            <!-- 图书类型 -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-700 mb-3">图书类型</h3>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="typeFilters"
                    value="paperback"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">平装</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="typeFilters"
                    value="hardcover"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">精装</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="typeFilters"
                    value="ebook"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">电子书</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="typeFilters"
                    value="audio"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">有声书</span>
                </label>
              </div>
            </div>

            <!-- 出版社 -->
            <div class="mb-6">
              <h3 class="font-medium text-gray-700 mb-3">出版社</h3>
              <div class="space-y-2 max-h-40 overflow-y-auto pr-2">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="publisherFilters"
                    value="人民文学出版社"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">人民文学出版社</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="publisherFilters"
                    value="商务印书馆"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">商务印书馆</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="publisherFilters"
                    value="中华书局"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">中华书局</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="publisherFilters"
                    value="三联书店"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">三联书店</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="publisherFilters"
                    value="中信出版社"
                    class="text-primary focus:ring-primary rounded"
                  />
                  <span class="ml-2 text-gray-600">中信出版社</span>
                </label>
              </div>
            </div>

            <button
              @click="resetFilters"
              class="w-full py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
            >
              重置筛选条件
            </button>
          </div>
        </div>

        <!-- 图书列表 -->
        <div class="flex-1">
          <!-- 排序和结果计数 -->
          <div
            class="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
          >
            <p v-if="!loading" class="text-gray-600">
              找到 <span class="text-primary font-medium">{{ totalItems }}</span> 本图书
            </p>
            <p v-else class="text-gray-600">正在加载图书...</p>
            <div class="mt-3 sm:mt-0 w-full sm:w-auto">
              <select
                v-model="sortBy"
                class="w-full sm:w-auto border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                @change="handleSortChange"
              >
                <option value="recommended">推荐排序</option>
                <option value="price-asc">价格从低到高</option>
                <option value="price-desc">价格从高到低</option>
                <option value="newest">最新上架</option>
                <option value="bestseller">畅销优先</option>
              </select>
            </div>
          </div>

          <!-- 加载状态 -->
          <div v-if="loading" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <i class="fa fa-circle-o-notch fa-spin text-4xl text-primary mb-4"></i>
            <p class="text-gray-600">正在努力加载...</p>
          </div>

          <!-- 图书网格 -->
          <div
            v-else-if="books.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <BookCard
              v-for="book in books"
              :key="book.id"
              :book="mapBookForCard(book)"
              @add-to-cart="addToCart"
              @add-to-wishlist="addToWishlist"
            />
          </div>

          <!-- 无结果状态 -->
          <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="w-20 h-20 mx-auto mb-4 text-gray-300">
              <i class="fa fa-search fa-5x"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">该分类下暂无图书</h3>
            <p class="text-gray-500 mb-4">去看看其他分类吧</p>
            <router-link
              to="/"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors inline-block"
            >
              返回首页
            </router-link>
          </div>

          <!-- 分页 -->
          <div v-if="!loading && books.length > 0" class="mt-8 flex justify-center">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :page-size="pageSize"
              :total-items="totalItems"
              @page-change="handlePageChange"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import api from '@/services/api'
import Footer from '@/components/layout/Footer.vue'
import BookCard from '@/components/books/BookCard.vue'
import Pagination from '@/components/layout/Pagination.vue'

export default {
  name: 'Category',
  components: {
    Footer,
    BookCard,
    Pagination,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()

    const books = ref([])
    const categoryInfo = ref(null)
    const loading = ref(true)
    const error = ref(null)
    const totalItems = ref(0)

    // 获取当前分类slug
    const categorySlug = computed(() => route.params.category || 'literature')

    // 筛选和排序状态
    const priceFilter = ref('all')
    const typeFilters = ref([])
    const publisherFilters = ref([])
    const sortBy = ref('recommended')
    const currentPage = ref(1)
    const pageSize = ref(12)

    // 计算总页数
    const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

    // 获取分类信息
    const fetchCategoryInfo = async () => {
      try {
        console.log('正在获取分类信息，slug:', categorySlug.value)

        const response = await api.get(`/categories/slug/${categorySlug.value}`)
        console.log('分类API响应:', response.data)

        // 增强响应数据检查
        if (!response.data || !response.data.id) {
          console.warn('分类数据不完整:', response.data)
          throw new Error('分类不存在或数据不完整')
        }

        // 确保分类信息正确存储
        categoryInfo.value = {
          id: Number(response.data.id),
          name: response.data.name || '',
          slug: response.data.slug || '',
          description: response.data.description || '',
        }

        console.log('处理后的分类信息:', categoryInfo.value)
        return true
      } catch (err) {
        console.error('获取分类信息失败:', {
          error: err,
          requestUrl: `/categories/slug/${categorySlug.value}`,
          stack: err.stack,
        })

        error.value = `获取分类失败: ${err.message}`
        router.push('/')
        return false
      }
    }

    // 获取分类图书
    const fetchCategoryBooks = async () => {
      loading.value = true
      error.value = null

      try {
        console.group('获取分类图书流程')

        // 1. 获取分类信息
        if (!(await fetchCategoryInfo())) {
          console.warn('终止获取图书：分类信息获取失败')
          return
        }

        // 2. 准备请求参数
        const params = {
          page: currentPage.value,
          limit: pageSize.value,
          sort: sortBy.value,
        }

        console.log('请求参数:', {
          categoryId: categoryInfo.value.id,
          ...params,
        })

        // 3. 发送请求
        const response = await api.get(`/books/category/${categoryInfo.value.id}`, { params })
        console.log('API原始响应:', response.data)

        // 4. 修复点：正确处理响应数据
        const responseData = response.data || {}
        books.value = Array.isArray(responseData.data) ? responseData.data : []
        totalItems.value = responseData.pagination?.total || 0

        console.log('处理后的图书数据:', {
          bookCount: books.value.length,
          firstBook: books.value[0] || null,
          totalItems: totalItems.value,
        })

        if (books.value.length === 0) {
          console.warn('该分类下没有图书')
          error.value = '该分类下暂无图书'
        }
      } catch (err) {
        console.error('获取图书失败:', {
          error: err,
          response: err.response?.data,
          request: err.config,
        })
        error.value = err.response?.data?.message || '获取图书失败，请稍后重试'
        books.value = []
      } finally {
        loading.value = false
        console.groupEnd()
      }
    }

    // 将后端返回的Book对象映射为BookCard需要的格式
    const mapBookForCard = (book) => {
      if (!book) return null

      return {
        id: book.id,
        image: book.cover_image || '/static/default-book-cover.jpg',
        title: book.title || '未知书名',
        author: book.author || '未知作者',
        rating: parseFloat(book.rating) || 0,
        reviews: book.review_count || 0,
        price: parseFloat(book.selling_price) || 0,
        originalPrice: parseFloat(book.original_price) || null,
        badge: book.is_new ? '新书' : book.is_hot ? '热销' : null,
        badgeClass: book.is_new ? 'bg-green-500' : book.is_hot ? 'bg-primary' : '',
        isBestseller: (book.sales_volume || 0) > 100,
        isNew: Boolean(book.is_new),
        discount: book.discount ? Math.round(book.discount) : null,
      }
    }

    // 处理排序变化
    const handleSortChange = () => {
      currentPage.value = 1
      fetchCategoryBooks()
    }

    // 处理分页变化
    const handlePageChange = (page) => {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
      fetchCategoryBooks()
    }

    // 重置筛选条件
    const resetFilters = () => {
      priceFilter.value = 'all'
      typeFilters.value = []
      publisherFilters.value = []
      sortBy.value = 'recommended'
      currentPage.value = 1
      fetchCategoryBooks()
    }

    // 添加到购物车
    const addToCart = (bookCard) => {
      const originalBook = books.value.find((b) => b.id === bookCard.id)
      if (originalBook) {
        cartStore.addItem({
          id: originalBook.id,
          title: originalBook.title,
          author: originalBook.author,
          coverImage: originalBook.cover_image,
          price: parseFloat(originalBook.selling_price),
          quantity: 1,
        })
      }
    }

    // 添加到收藏
    const addToWishlist = (bookCard) => {
      const originalBook = books.value.find((b) => b.id === bookCard.id)
      if (originalBook) {
        wishlistStore.addItem(originalBook)
      }
    }

    // 初始加载
    onMounted(() => {
      fetchCategoryBooks()
    })

    // 监听路由变化
    watch(
      () => route.params.category,
      (newSlug) => {
        if (newSlug) {
          currentPage.value = 1
          categoryInfo.value = null
          fetchCategoryBooks()
        }
      },
      { immediate: true },
    )

    // 监听排序和筛选变化
    watch([priceFilter, typeFilters, publisherFilters], () => {
      currentPage.value = 1
    })

    return {
      categoryInfo,
      loading,
      books,
      totalItems,
      priceFilter,
      typeFilters,
      publisherFilters,
      sortBy,
      currentPage,
      pageSize,
      totalPages,
      handleSortChange,
      handlePageChange,
      resetFilters,
      addToCart,
      addToWishlist,
      mapBookForCard,
    }
  },
}
</script>

<style scoped>
/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
