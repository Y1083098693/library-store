<template>
  <section class="py-10 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">限时特惠</h2>
        <div class="flex items-center">
          <div class="flex space-x-1 mr-4">
            <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono">
              08
            </div>
            <span class="flex items-center">:</span>
            <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono">
              45
            </div>
            <span class="flex items-center">:</span>
            <div class="w-8 h-8 bg-gray-100 rounded flex items-center justify-center font-mono">
              32
            </div>
          </div>
          <a href="#" class="text-primary hover:text-primary/80 flex items-center">
            查看更多 <i class="fa fa-angle-right ml-1"></i>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <BookCard v-for="(book, index) in limitedOfferBooks" :key="index" :book="book" />
      </div>
    </div>
  </section>
</template>

<script>
import BookCard from './BookCard.vue'

export default {
  name: 'LimitedOffer',
  components: {
    BookCard,
  },
  data() {
    return {
      limitedOfferBooks: [
        {
          image: 'https://picsum.photos/id/42/300/450',
          title: '活着',
          author: '余华',
          price: '28.00',
          originalPrice: '39.50',
          discount: 30,
        },
        {
          image: 'https://picsum.photos/id/43/300/450',
          title: '三体',
          author: '刘慈欣',
          price: '29.80',
          originalPrice: '49.80',
          discount: 40,
        },
        {
          image: 'https://picsum.photos/id/44/300/450',
          title: '我们仨',
          author: '杨绛',
          price: '22.50',
          originalPrice: '29.80',
          discount: 25,
        },
        {
          image: 'https://picsum.photos/id/45/300/450',
          title: '百年孤独',
          author: '加西亚·马尔克斯',
          price: '36.80',
          originalPrice: '59.00',
          discount: 35,
        },
      ],
    }
  },
}
</script>
