<template>
  <section class="py-8 bg-white">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-4 md:grid-cols-8 gap-4 text-center">
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <i class="fa fa-book text-primary"></i>
          </div>
          <span class="text-sm">文学小说</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
            <i class="fa fa-briefcase text-accent"></i>
          </div>
          <span class="text-sm">社科经管</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
            <i class="fa fa-flask text-secondary"></i>
          </div>
          <span class="text-sm">科技科普</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <i class="fa fa-leaf text-green-600"></i>
          </div>
          <span class="text-sm">生活艺术</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <i class="fa fa-graduation-cap text-purple-600"></i>
          </div>
          <span class="text-sm">教育学习</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
            <i class="fa fa-child text-yellow-600"></i>
          </div>
          <span class="text-sm">少儿读物</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <i class="fa fa-gift text-red-600"></i>
          </div>
          <span class="text-sm">礼品书</span>
        </a>
        <a
          href="#"
          class="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <i class="fa fa-newspaper-o text-blue-600"></i>
          </div>
          <span class="text-sm">杂志期刊</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CategoryNav',
}
</script>
