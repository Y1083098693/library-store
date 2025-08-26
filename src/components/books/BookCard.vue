<template>
  <div
    class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    @click="goToDetail"
  >
    <div class="relative">
      <div class="w-full bg-gray-200 relative overflow-hidden" style="aspect-ratio: 2/3">
        <div
          v-if="!imageLoaded && !imageError"
          class="absolute inset-0 bg-gray-200 animate-pulse"
        ></div>
        <div
          v-if="imageError"
          class="absolute inset-0 bg-gray-200 flex items-center justify-center"
        >
          <i class="fa fa-image text-gray-400 text-2xl"></i>
        </div>
        <img
          :src="effectiveImageUrl"
          :alt="book?.title || '图书封面'"
          class="w-full h-full object-cover transition-opacity duration-300"
          :class="{
            'opacity-0': !imageLoaded || imageError,
            'opacity-100': imageLoaded && !imageError,
          }"
          @load="handleImageLoad"
          @error="handleImageError"
        />
      </div>

      <span
        v-if="book?.badge"
        class="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded shadow-sm"
        :class="book.badgeClass || 'bg-primary'"
      >
        {{ book.badge }}
      </span>

      <span
        v-if="book?.discount"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-sm"
      >
        -{{ Math.round(book.discount) }}%
      </span>
    </div>

    <div class="p-3">
      <h3 class="font-medium text-gray-800 line-clamp-2 h-12 mb-1">
        {{ book?.title || '未知书名' }}
      </h3>
      <p class="text-gray-500 text-sm line-clamp-1">{{ book?.author || '未知作者' }}</p>

      <div class="flex items-center mt-2">
        <div class="text-yellow-400 text-xs">
          <i v-for="star in 5" :key="star" :class="getStarClass(star, book?.rating || 0)"></i>
        </div>
        <span class="text-gray-500 text-xs ml-1"> ({{ book?.reviews || 0 }}) </span>
      </div>

      <div class="mt-2 flex items-center justify-between">
        <div>
          <span class="text-primary font-medium text-lg">¥{{ formatPrice(book?.price) }}</span>
          <span v-if="book?.originalPrice" class="text-gray-400 text-sm line-through ml-2">
            ¥{{ formatPrice(book.originalPrice) }}
          </span>
        </div>
        <button
          class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
          @click.stop="$emit('add-to-cart', book)"
          aria-label="加入购物车"
        >
          <i class="fa fa-shopping-cart text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { config } from '@/config'

export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  emits: ['add-to-cart'],
  setup(props) {
    const router = useRouter()

    const goToDetail = () => {
      if (props.book.id) {
        router.push(`/books/${props.book.id}`)
      }
    }

    return {
      goToDetail,
    }
  },
  data() {
    return {
      imageLoaded: false,
      imageError: false,
    }
  },
  computed: {
    effectiveImageUrl() {
      if (!this.book) return ''
      const coverPath = this.book?.cover_image || this.book?.image
      if (!coverPath) return ''

      if (coverPath.startsWith('http')) return coverPath
      return coverPath.startsWith('/')
        ? `${config.apiBaseURL}${coverPath}`
        : `${config.apiBaseURL}/${coverPath}`
    },
  },
  methods: {
    handleImageLoad() {
      this.imageLoaded = true
      this.imageError = false
    },
    handleImageError() {
      this.imageError = true
      this.imageLoaded = true
    },
    getStarClass(star, rating) {
      const normalizedRating = parseFloat(rating) || 0
      if (star <= Math.floor(normalizedRating)) return 'fa fa-star'
      if (star === Math.ceil(normalizedRating) && !Number.isInteger(normalizedRating))
        return 'fa fa-star-half-o'
      return 'fa fa-star-o'
    },
    formatPrice(price) {
      const num = parseFloat(price || 0)
      return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2)
    },
  },
}
</script>

<style scoped>
.hover\:shadow-md {
  transition: box-shadow 0.2s ease;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
