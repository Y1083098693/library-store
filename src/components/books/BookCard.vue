<template>
  <div class="bg-white rounded-lg overflow-hidden shadow-sm hover-lift">
    <div class="relative">
      <img :src="book.image" :alt="book.title" class="w-full aspect-[2/3] object-cover" />
      <span
        v-if="book.badge"
        class="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded"
        :class="book.badgeClass"
      >
        {{ book.badge }}
      </span>
      <span
        v-if="book.discount"
        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
      >
        -{{ book.discount }}%
      </span>
    </div>
    <div class="p-3">
      <h3 class="font-medium text-gray-800 line-clamp-2 h-12">{{ book.title }}</h3>
      <p class="text-gray-500 text-sm mt-1 line-clamp-1">{{ book.author }}</p>
      <div class="flex items-center mt-2">
        <div class="text-yellow-400 text-xs">
          <i v-for="star in 5" :key="star" :class="getStarClass(star, book.rating)"></i>
        </div>
        <span class="text-gray-500 text-xs ml-1">({{ book.reviews }})</span>
      </div>
      <div class="mt-2 flex items-center justify-between">
        <div>
          <span class="text-primary font-medium">¥{{ book.price }}</span>
          <span v-if="book.originalPrice" class="text-gray-400 text-sm line-through ml-1"
            >¥{{ book.originalPrice }}</span
          >
        </div>
        <button
          class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
        >
          <i class="fa fa-shopping-cart text-sm"></i>
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
    },
  },
  methods: {
    getStarClass(star, rating) {
      if (star <= Math.floor(rating)) return 'fa fa-star'
      if (star === Math.ceil(rating) && !Number.isInteger(rating)) return 'fa fa-star-half-o'
      return 'fa fa-star-o'
    },
  },
}
</script>
