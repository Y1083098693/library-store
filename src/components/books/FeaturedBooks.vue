<template>
  <section class="py-10 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">精选推荐</h2>
        <a href="#" class="text-primary hover:text-primary/80 flex items-center">
          查看更多 <i class="fa fa-angle-right ml-1"></i>
        </a>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        <BookCard
          v-for="book in featuredBooks"
          :key="book.id"
          :book="book"
          @add-to-cart="$emit('add-to-cart', book)"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BookCard from './BookCard.vue'

export default {
  name: 'FeaturedBooks',
  components: {
    BookCard,
  },
  emits: ['add-to-cart'],
  data() {
    return {
      featuredBooks: [
        {
          id: 1, // 必须包含唯一ID
          image: 'https://picsum.photos/id/24/300/450',
          title: '人类简史：从动物到上帝',
          author: '尤瓦尔·赫拉利',
          rating: 4.5,
          reviews: 128,
          price: '59.00',
          originalPrice: '89.00',
          badge: '热销',
          badgeClass: 'bg-primary',
        },
        {
          id: 2,
          image: 'https://picsum.photos/id/20/300/450',
          title: '置身事内：中国政府与经济发展',
          author: '兰小欢',
          rating: 5,
          reviews: 256,
          price: '45.00',
          originalPrice: '59.00',
          badge: '新书',
          badgeClass: 'bg-green-500',
        },
        {
          id: 3,
          image: 'https://picsum.photos/id/21/300/450',
          title: '夜晚的潜水艇',
          author: '陈春成',
          rating: 4,
          reviews: 98,
          price: '42.00',
          originalPrice: '58.00',
        },
        {
          id: 4,
          image: 'https://picsum.photos/id/22/300/450',
          title: '小王子（精装珍藏版）',
          author: '安托万·德·圣-埃克苏佩里',
          rating: 4.5,
          reviews: 324,
          price: '32.00',
          originalPrice: '49.80',
          badge: '热销',
          badgeClass: 'bg-primary',
        },
        {
          id: 5,
          image: 'https://picsum.photos/id/23/300/450',
          title: '解忧杂货店',
          author: '东野圭吾',
          rating: 4,
          reviews: 187,
          price: '45.00',
          originalPrice: '59.00',
        },
      ],
    }
  },
}
</script>
