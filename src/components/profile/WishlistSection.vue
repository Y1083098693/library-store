<template>
  <section class="bg-white rounded-xl shadow-sm p-6 lg:p-8 border border-gray-100">
    <h3 class="text-xl font-semibold mb-6 text-gray-800">我的收藏</h3>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      v-if="favorites.length > 0"
    >
      <div
        class="book-card border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
        v-for="book in favorites"
        :key="book.id"
      >
        <div class="book-image relative">
          <img
            :src="book.cover_url || defaultBookImage"
            alt="图书封面"
            class="w-full h-48 object-cover"
          />
          <button
            class="absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 hover:bg-red-50 transition-colors"
            @click.prevent="$emit('remove-from-wishlist', book.id)"
            aria-label="取消收藏"
          >
            <i class="fa fa-heart"></i>
          </button>
        </div>
        <div class="book-info p-4">
          <h4 class="font-medium mb-2 line-clamp-1">{{ book.title }}</h4>
          <p class="text-gray-600 text-sm mb-2 line-clamp-1">作者：{{ book.author }}</p>
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ book.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-primary font-medium">¥{{ book.price }}</span>
            <button
              class="bg-primary text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state text-center py-16" v-if="favorites.length === 0 && !isLoading">
      <i class="fa fa-heart text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">暂无收藏的图书</p>
    </div>

    <div class="pagination flex justify-center mt-8" v-if="total > 0">
      <button
        class="px-3 py-1.5 border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        上一页
      </button>
      <span class="px-3 py-1.5 border-t border-b border-gray-300 bg-gray-50">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      <button
        class="px-3 py-1.5 border border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WishlistSection',
  props: {
    favorites: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 8,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    defaultBookImage: {
      type: String,
      default: 'https://picsum.photos/id/24/200/300',
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit)
    },
  },
  methods: {
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('change-page', page)
      }
    },
  },
}
</script>
