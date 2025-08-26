<template>
  <section class="py-8 bg-white" v-if="categories.length > 0">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-4 md:grid-cols-8 gap-6 text-center">
        <!-- 动态生成8个分类导航 -->
        <router-link
          v-for="(category, index) in displayedCategories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors group"
        >
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors group-hover:scale-110"
            :class="getCategoryBgClass(index)"
          >
            <i
              :class="getCategoryIcon(index)"
              class="text-xl"
              :style="{ color: getCategoryColor(index) }"
            ></i>
          </div>
          <span
            class="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors"
          >
            {{ category.name }}
          </span>
        </router-link>
      </div>
    </div>
  </section>

  <!-- 加载状态 -->
  <section class="py-8 bg-white" v-else-if="loadingCategories">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-4 md:grid-cols-8 gap-6 text-center">
        <div v-for="n in 8" :key="n" class="flex flex-col items-center p-4">
          <div class="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-3"></div>
          <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCategories } from '@/services/bookService'

export default {
  name: 'CategoryNav',

  setup() {
    const categories = ref([])
    const loadingCategories = ref(true)
    const route = useRoute()

    // 只显示前8个分类
    const displayedCategories = computed(() => {
      return categories.value.slice(0, 8)
    })

    const fetchCategories = async () => {
      loadingCategories.value = true
      try {
        categories.value = await getCategories()
      } catch (error) {
        console.error('获取分类失败:', error)
      } finally {
        loadingCategories.value = false
      }
    }

    // 根据截图中的顺序设置图标
    const getCategoryIcon = (index) => {
      const icons = [
        'fa fa-book', // 1. 文学小说
        'fa fa-flask', // 2. 科学技术
        'fa fa-bar-chart', // 3. 社科经管
        'fa fa-money', // 4. 经济管理
        'fa fa-globe', // 5. 人文社科
        'fa fa-desktop', // 6. 科技科普
        'fa fa-graduation-cap', // 7. 教育学习
        'fa fa-paint-brush', // 8. 生活艺术
      ]
      return icons[index] || 'fa fa-book'
    }

    // 背景颜色 - 使用更鲜艳的颜色
    const getCategoryBgClass = (index) => {
      const bgClasses = [
        'bg-blue-100', // 文学小说
        'bg-green-100', // 科学技术
        'bg-purple-100', // 社科经管
        'bg-yellow-100', // 经济管理
        'bg-orange-100', // 人文社科
        'bg-teal-100', // 科技科普
        'bg-pink-100', // 教育学习
        'bg-red-100', // 生活艺术
      ]
      return bgClasses[index] || 'bg-gray-100'
    }

    // 文字颜色 - 使用更鲜艳的颜色
    const getCategoryColor = (index) => {
      const colors = [
        '#2563eb', // blue-600
        '#059669', // green-600
        '#7c3aed', // purple-600
        '#ca8a04', // yellow-600
        '#ea580c', // orange-600
        '#0d9488', // teal-600
        '#db2777', // pink-600
        '#dc2626', // red-600
      ]
      return colors[index] || '#6b7280'
    }

    onMounted(() => {
      fetchCategories()
    })

    return {
      categories,
      displayedCategories,
      loadingCategories,
      getCategoryIcon,
      getCategoryBgClass,
      getCategoryColor,
    }
  },
}
</script>

<style scoped>
/* 激活状态样式 */
.router-link-active .w-16 {
  @apply ring-2 ring-primary ring-offset-2;
}

.router-link-active span {
  @apply text-primary font-semibold;
}

/* 悬停动画 */
.group:hover .w-16 {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }

  .w-16,
  .h-16 {
    width: 3.5rem;
    height: 3.5rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .w-16,
  .h-16 {
    width: 3rem;
    height: 3rem;
  }

  .text-sm {
    font-size: 0.75rem;
  }
}
</style>
