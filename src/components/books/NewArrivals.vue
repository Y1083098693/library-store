<template>
  <section class="py-10 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">新品上架</h2>
        <a href="#" class="text-primary hover:text-primary/80 flex items-center">
          查看更多 <i class="fa fa-angle-right ml-1"></i>
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <BookCard v-for="(book, index) in newArrivals" :key="index" :book="book" />
      </div>
    </div>
  </section>
</template>

<script>
import BookCard from './BookCard.vue'

export default {
  name: 'NewArrivals',
  components: {
    BookCard,
  },
  data() {
    return {
      newArrivals: [
        {
          image: 'https://picsum.photos/id/64/300/450',
          title: '长安的荔枝',
          author: '马伯庸',
          price: '45.00',
          badge: '新书',
          badgeClass: 'bg-green-500',
        },
        {
          image: 'https://picsum.photos/id/65/300/450',
          title: '蛤蟆先生去看心理医生',
          author: '罗伯特·戴博德',
          price: '49.80',
          badge: '新书',
          badgeClass: 'bg-green-500',
        },
        {
          image: 'https://picsum.photos/id/66/300/450',
          title: '置身事内：中国政府与经济发展',
          author: '兰小欢',
          price: '59.00',
          badge: '新书',
          badgeClass: 'bg-green-500',
        },
        {
          image: 'https://picsum.photos/id/67/300/450',
          title: '可能性的艺术',
          author: '刘瑜',
          price: '68.00',
          badge: '新书',
          badgeClass: 'bg-green-500',
        },
      ],
    }
  },
}
</script>
