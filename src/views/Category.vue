<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 分类标题栏 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800">
          {{ categoryName }}
        </h1>
        <p class="text-gray-500 mt-1">探索 {{ categoryDescription }}</p>
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
            <p class="text-gray-600">
              找到 <span class="text-primary font-medium">{{ filteredBooks.length }}</span> 本图书
            </p>
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

          <!-- 图书网格 -->
          <div
            v-if="filteredBooks.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <BookCard
              v-for="book in paginatedBooks"
              :key="book.id"
              :book="book"
              @add-to-cart="addToCart"
              @add-to-wishlist="addToWishlist"
            />
          </div>

          <!-- 无结果状态 -->
          <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="w-20 h-20 mx-auto mb-4 text-gray-300">
              <i class="fa fa-search fa-5x"></i>
            </div>
            <h3 class="text-lg font-medium text-gray-700 mb-2">未找到符合条件的图书</h3>
            <p class="text-gray-500 mb-4">尝试调整筛选条件或浏览其他分类</p>
            <button
              @click="resetFilters"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              清除筛选条件
            </button>
          </div>

          <!-- 分页 -->
          <div v-if="filteredBooks.length > 0" class="mt-8 flex justify-center">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :page-size="pageSize"
              :total-items="filteredBooks.length"
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
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import Footer from '@/components/layout/footer.vue'
import BookCard from '@/components/books/BookCard.vue'
import Pagination from '@/components/layout/Pagination.vue'
import { generateMockBooks, CATEGORY_INFO } from '@/mocks/CategoryMockData'

export default {
  name: 'Category',
  components: {
    Footer,
    BookCard,
    Pagination,
  },
  setup() {
    const route = useRoute()
    const cartStore = useCartStore()
    const wishlistStore = useWishlistStore()

    // 获取当前分类
    const category = route.params.category || 'literature'
    const categoryInfo = CATEGORY_INFO[category] || CATEGORY_INFO['literature']

    // 筛选条件
    const priceFilter = ref('all')
    const typeFilters = ref([])
    const publisherFilters = ref([])
    const sortBy = ref('recommended')

    // 分页控制
    const currentPage = ref(1)
    const pageSize = ref(12)

    // 模拟图书数据 - 使用导入的generateMockBooks函数
    const books = ref([])

    // 初始化数据
    onMounted(() => {
      // 调用从mock文件导入的函数生成数据，并传入当前分类
      books.value = generateMockBooks(category)
    })

    // 筛选图书
    const filteredBooks = computed(() => {
      return books.value
        .filter((book) => {
          // 价格筛选
          if (priceFilter.value !== 'all') {
            if (priceFilter.value === '0-50' && (book.price < 0 || book.price > 50)) return false
            if (priceFilter.value === '50-100' && (book.price < 50 || book.price > 100))
              return false
            if (priceFilter.value === '100+' && book.price < 100) return false
          }

          // 类型筛选
          if (
            typeFilters.value.length > 0 &&
            !typeFilters.value.includes(
              book.type === '平装'
                ? 'paperback'
                : book.type === '精装'
                  ? 'hardcover'
                  : book.type === '电子书'
                    ? 'ebook'
                    : 'audio',
            )
          ) {
            return false
          }

          // 出版社筛选
          if (
            publisherFilters.value.length > 0 &&
            !publisherFilters.value.includes(book.publisher)
          ) {
            return false
          }

          return true
        })
        .sort((a, b) => {
          // 排序逻辑
          switch (sortBy.value) {
            case 'price-asc':
              return a.price - b.price
            case 'price-desc':
              return b.price - a.price
            case 'newest':
              return a.isNew ? -1 : 1
            case 'bestseller':
              return a.isBestseller ? -1 : 1
            default: // recommended
              // 综合排序：畅销优先，然后是评分，然后是价格
              if (a.isBestseller && !b.isBestseller) return -1
              if (!a.isBestseller && b.isBestseller) return 1
              return b.rating - a.rating || a.price - b.price
          }
        })
    })

    // 分页处理
    const paginatedBooks = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value
      return filteredBooks.value.slice(startIndex, startIndex + pageSize.value)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredBooks.value.length / pageSize.value)
    })

    // 处理排序变化
    const handleSortChange = () => {
      currentPage.value = 1 // 排序变化时重置到第一页
    }

    // 处理分页变化
    const handlePageChange = (page) => {
      currentPage.value = page
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 重置筛选条件
    const resetFilters = () => {
      priceFilter.value = 'all'
      typeFilters.value = []
      publisherFilters.value = []
      sortBy.value = 'recommended'
      currentPage.value = 1
    }

    // 添加到购物车
    const addToCart = (book) => {
      cartStore.addItem({
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
        price: book.price,
        quantity: 1,
      })
    }

    // 添加到收藏
    const addToWishlist = (book) => {
      wishlistStore.addItem(book)
    }

    // 监听路由变化，重新生成数据
    watch(
      () => route.params.category,
      (newCategory) => {
        if (newCategory) {
          // 路由变化时使用导入的函数重新生成对应分类的数据
          books.value = generateMockBooks(newCategory)
          resetFilters()
        }
      },
    )

    return {
      categoryName: categoryInfo.name,
      categoryDescription: categoryInfo.description,
      priceFilter,
      typeFilters,
      publisherFilters,
      sortBy,
      currentPage,
      pageSize,
      filteredBooks,
      paginatedBooks,
      totalPages,
      handleSortChange,
      handlePageChange,
      resetFilters,
      addToCart,
      addToWishlist,
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
