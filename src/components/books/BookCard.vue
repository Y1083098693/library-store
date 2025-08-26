<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-sm hover-lift transition-transform duration-200 hover:-translate-y-1"
  >
    <div class="relative">
      <!-- 图片（添加错误处理） -->
      <img
        :src="book.image || '/static/default-book-cover.jpg'"
        :alt="book.title"
        class="w-full aspect-[2/3] object-cover"
        @error="handleImageError"
      />

      <!-- 徽标（增强条件判断） -->
      <span
        v-if="book.badge"
        class="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded"
        :class="book.badgeClass || 'bg-primary'"
      >
        {{ book.badge }}
      </span>

      <!-- 折扣标签（数值格式化） -->
      <span
        v-if="book.discount"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
      >
        -{{ Math.round(book.discount) }}%
      </span>
    </div>

    <div class="p-3">
      <!-- 标题（确保有默认值） -->
      <h3 class="font-medium text-gray-800 line-clamp-2 h-12">
        {{ book.title || '未知书名' }}
      </h3>

      <!-- 作者（确保有默认值） -->
      <p class="text-gray-500 text-sm mt-1 line-clamp-1">
        {{ book.author || '未知作者' }}
      </p>

      <!-- 评分（修复重复的评分显示） -->
      <div class="flex items-center mt-2">
        <div class="text-yellow-400 text-xs">
          <i v-for="star in 5" :key="star" :class="getStarClass(star, book.rating || 0)"></i>
        </div>
        <span class="text-gray-500 text-xs ml-1"> ({{ book.reviews || 0 }}) </span>
      </div>

      <!-- 价格（格式化价格显示） -->
      <div class="mt-2 flex items-center justify-between">
        <div>
          <span class="text-primary font-medium"> ¥{{ formatPrice(book.price) }} </span>
          <span v-if="book.originalPrice" class="text-gray-400 text-sm line-through ml-1">
            ¥{{ formatPrice(book.originalPrice) }}
          </span>
        </div>
        <button
          class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
          @click="$emit('add-to-cart', book)"
        >
          <i class="fa-solid fa-cart-plus text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true,
      validator: (book) => {
        // 确保必要字段存在
        return book && book.id && (book.title || book.image)
      },
    },
  },
  methods: {
    // 修复星星评分方法
    getStarClass(star, rating) {
      const normalizedRating = parseFloat(rating) || 0
      if (star <= Math.floor(normalizedRating)) return 'fa-solid fa-star'
      if (star === Math.ceil(normalizedRating) && !Number.isInteger(normalizedRating)) {
        return 'fa-solid fa-star-half-alt'
      }
      return 'fa-regular fa-star'
    },

    // 图片加载错误处理
    handleImageError(event) {
      event.target.src = '/static/default-book-cover.jpg'
    },

    // 价格格式化
    formatPrice(price) {
      const num = parseFloat(price || 0)
      return num.toFixed(num % 1 === 0 ? 0 : 2)
    },
  },
}
</script>

<style scoped>
.hover-lift {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* 图片加载动画 */
img {
  transition: opacity 0.3s ease;
}
img:not([src]) {
  opacity: 0;
}
img.loaded {
  opacity: 1;
}
</style>
