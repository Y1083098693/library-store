<template>
  <div class="loading-state flex items-center justify-center py-8">
    <div
      class="loader w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
    ></div>
    <p class="ml-3 text-gray-600" v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingState',
  props: {
    // 可选的加载提示文字
    message: {
      type: String,
      default: '加载中...',
    },
  },
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
