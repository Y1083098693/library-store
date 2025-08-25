<template>
  <div class="home">
    <HeroCarousel />
    <CategoryNav />
    <FeaturedBooks />
    <LimitedOffer />
    <NewArrivals />
  </div>
</template>

<script>
import HeroCarousel from '@/components/books/HeroCarousel.vue'
import CategoryNav from '@/components/books/CategoryNav.vue'
import FeaturedBooks from '@/components/books/FeaturedBooks.vue'
import LimitedOffer from '@/components/books/LimitedOffer.vue'
import NewArrivals from '@/components/books/NewArrivals.vue'

export default {
  name: 'Home',
  components: {
    HeroCarousel,
    CategoryNav,
    FeaturedBooks,
    LimitedOffer,
    NewArrivals,
  },
}
</script>
