<template>
  <div class="app bg-gray-50 text-gray-800 font-sans min-h-screen">
    <Header />
    <main class="min-h-screen">
      <router-view />
    </main>
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'

export default {
  name: 'App',
  components: {
    Header,
  },
  mounted() {
    // 确保Header组件挂载
    console.log('App mounted, Header should be visible')
  },
}
</script>
