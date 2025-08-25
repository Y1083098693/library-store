<template>
  <div class="relative bg-gray-100 overflow-hidden">
    <div class="container mx-auto px-4">
      <div
        ref="carouselContainer"
        class="carousel-container relative h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg"
      >
        <!-- 加载状态 -->
        <div
          v-if="isLoading"
          class="absolute inset-0 flex items-center justify-center bg-white z-10"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
          ></div>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="hasError"
          class="absolute inset-0 flex flex-col items-center justify-center bg-white p-4 z-10"
        >
          <p class="text-red-500 mb-4">{{ errorMessage }}</p>
          <button
            @click="fetchSlides"
            class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            重试加载
          </button>
        </div>

        <!-- 轮播内容 -->
        <div v-else-if="slides.length > 0" class="relative h-full">
          <!-- 轮播轨道 -->
          <div
            class="flex h-full transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
          >
            <!-- 轮播项 -->
            <div
              v-for="(slide, index) in sortedSlides"
              :key="slide.id || index"
              class="min-w-full h-full relative"
            >
              <!-- 图片容器带骨架屏 -->
              <div class="w-full h-full bg-gray-200 relative overflow-hidden">
                <img
                  :src="getImageUrl(slide.image_url)"
                  :alt="slide.title || '轮播图片'"
                  class="w-full h-full object-cover transition-opacity duration-500"
                  @load="handleImageLoad(index)"
                  @error="handleImageError(index, slide.image_url)"
                  :class="{
                    'opacity-0': imageErrors[index] || !imageLoads[index],
                    'opacity-100': !imageErrors[index] && imageLoads[index],
                  }"
                />

                <!-- 图片加载骨架屏 -->
                <div
                  v-if="!imageLoads[index] && !imageErrors[index]"
                  class="absolute inset-0 bg-gray-200 animate-pulse"
                ></div>

                <!-- 图片错误提示 -->
                <div
                  v-if="imageErrors[index]"
                  class="absolute inset-0 bg-gray-200 flex items-center justify-center"
                >
                  <i class="fa fa-image text-gray-400 text-4xl"></i>
                </div>
              </div>

              <!-- 轮播内容覆盖层 -->
              <div
                class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex items-center"
              >
                <div
                  class="text-white max-w-md p-4 md:p-8 mx-auto md:mx-0 transform translate-y-0 md:-translate-y-1/4"
                >
                  <h2 class="text-2xl md:text-4xl font-bold mb-2 text-shadow animate-fade-in-up">
                    {{ slide.title || '轮播标题' }}
                  </h2>
                  <p class="mb-4 text-gray-100 animate-fade-in-up animation-delay-150">
                    {{ slide.description || '轮播描述内容' }}
                  </p>
                  <a
                    :href="slide.link || '#'"
                    class="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md transition-all transform hover:scale-105 animate-fade-in-up animation-delay-300"
                  >
                    {{ slide.button_text || '查看详情' }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 导航按钮 -->
          <button
            @click="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all transform hover:scale-110 z-10"
            aria-label="上一张"
          >
            <i class="fa fa-angle-left text-xl"></i>
          </button>

          <button
            @click="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/50 transition-all transform hover:scale-110 z-10"
            aria-label="下一张"
          >
            <i class="fa fa-angle-right text-xl"></i>
          </button>

          <!-- 指示器 -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            <button
              v-for="(slide, index) in sortedSlides"
              :key="slide.id || index"
              class="w-3 h-3 rounded-full transition-all duration-300"
              :class="{
                'bg-white w-6': currentIndex === index,
                'bg-white/50 hover:bg-white/80': currentIndex !== index,
              }"
              @click="goToSlide(index)"
              :aria-label="`转到幻灯片 ${index + 1}`"
            ></button>
          </div>
        </div>

        <div v-else class="absolute inset-0 flex items-center justify-center bg-white p-4">
          <p class="text-gray-500">暂无轮播图数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { config } from '@/config'

// 状态管理
const slides = ref([])
const currentIndex = ref(0)
const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref('')
const imageErrors = ref({})
const imageLoads = ref({})
const carouselInterval = ref(null)
const carouselContainer = ref(null)

// 配置
const DEFAULT_IMAGE = 'https://picsum.photos/id/20/1200/400' // 仅在图片加载失败时使用
const CAROUSEL_INTERVAL = 5000

// 按sort_order排序轮播图
const sortedSlides = computed(() => {
  // 复制数组并按sort_order升序排序
  return [...slides.value].sort((a, b) => {
    // 处理可能的null或undefined值
    const orderA = a.sort_order ?? 0
    const orderB = b.sort_order ?? 0
    return orderA - orderB
  })
})

/**
 * 处理图片URL
 * @param {string} imagePath - 数据库中存储的图片路径
 * @returns {string} 完整的图片URL
 */
const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') {
    console.warn('无效的图片路径，使用默认图片')
    return DEFAULT_IMAGE
  }

  // 如果是完整URL直接使用
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // 如果路径以/开头，直接拼接API基础URL
  if (imagePath.startsWith('/')) {
    return `${config.apiBaseURL}${imagePath}`
  }

  // 否则拼接完整路径
  return `${config.apiBaseURL}/${imagePath}`
}

// 方法：获取轮播数据
const fetchSlides = async () => {
  try {
    isLoading.value = true
    hasError.value = false
    errorMessage.value = ''

    console.log('请求轮播数据接口:', '/api/carousels')
    const response = await fetch('/api/carousels', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    console.log('接口响应状态:', response.status)

    // 即使响应状态不是200，也尝试解析数据
    const result = await response.json().catch((err) => {
      console.error('解析响应数据失败:', err)
      return null
    })

    console.log('接口返回数据:', result)

    // 放宽数据验证条件，只要有基本的id和image_url就认为有效
    if (result && result.data && Array.isArray(result.data)) {
      const validSlides = result.data.filter((slide) => slide && slide.id && slide.image_url)

      console.log('验证后的有效轮播数据:', validSlides)
      slides.value = validSlides
    } else {
      // 如果接口返回格式不符合预期，尝试直接使用响应数据
      if (Array.isArray(result)) {
        slides.value = result.filter((slide) => slide && slide.id && slide.image_url)
      } else {
        console.warn('轮播数据格式不正确，使用空数据')
        slides.value = []
      }
    }
  } catch (err) {
    console.error('获取轮播数据失败:', err)
    // 出错时不清空可能已有的数据，保留上次成功加载的数据
    if (slides.value.length === 0) {
      hasError.value = true
      errorMessage.value = '加载轮播图失败，请稍后重试'
    }
  } finally {
    isLoading.value = false
  }
}

// 图片错误处理
const handleImageError = (index, imagePath) => {
  const fullUrl = getImageUrl(imagePath)
  console.warn(`轮播图 ${index} 加载失败，URL: ${fullUrl}`)
  imageErrors.value = { ...imageErrors.value, [index]: true }
  if (imageLoads.value[index]) {
    imageLoads.value = { ...imageLoads.value, [index]: false }
  }
}

// 轮播控制方法
const nextSlide = () => {
  if (sortedSlides.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % sortedSlides.value.length
}

const prevSlide = () => {
  if (sortedSlides.value.length <= 1) return
  currentIndex.value =
    (currentIndex.value - 1 + sortedSlides.value.length) % sortedSlides.value.length
}

const goToSlide = (index) => {
  if (index >= 0 && index < sortedSlides.value.length && index !== currentIndex.value) {
    currentIndex.value = index
  }
}

// 图片加载处理
const handleImageLoad = (index) => {
  imageLoads.value = { ...imageLoads.value, [index]: true }
  if (imageErrors.value[index]) {
    imageErrors.value = { ...imageErrors.value, [index]: false }
  }
}

// 自动轮播控制
const startCarousel = () => {
  if (carouselInterval.value || sortedSlides.value.length <= 1) return

  carouselInterval.value = setInterval(() => {
    nextSlide()
  }, CAROUSEL_INTERVAL)
}

const stopCarousel = () => {
  if (carouselInterval.value) {
    clearInterval(carouselInterval.value)
    carouselInterval.value = null
  }
}

// 页面可见性变化处理
const handleVisibilityChange = () => {
  if (document.hidden) {
    stopCarousel()
  } else if (sortedSlides.value.length > 1) {
    startCarousel()
  }
}

// 监听轮播数据变化
watch(sortedSlides, (newVal) => {
  stopCarousel()
  currentIndex.value = 0
  if (newVal.length > 1) {
    startCarousel()
  }
})

// 生命周期钩子
onMounted(async () => {
  await fetchSlides()

  if (sortedSlides.value.length > 1) {
    startCarousel()
  }

  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('mouseenter', stopCarousel)
    carouselContainer.value.addEventListener('mouseleave', startCarousel)
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  stopCarousel()

  if (carouselContainer.value) {
    carouselContainer.value.removeEventListener('mouseenter', stopCarousel)
    carouselContainer.value.removeEventListener('mouseleave', startCarousel)
  }

  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

@media (max-width: 768px) {
  .carousel-container {
    height: 250px !important;
  }

  .text-white {
    text-align: center;
  }

  .bg-gradient-to-r {
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
  }
}
</style>
