<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <!-- 顶部通知 -->
    <TopNotice />

    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-4">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold text-secondary flex items-center">
            <i class="fa fa-book mr-2 text-primary"></i>
            <span>小白书城</span>
          </router-link>
        </div>

        <!-- 搜索框 -->
        <div class="hidden md:block flex-1 max-w-xl mx-8">
          <div class="relative">
            <input
              type="text"
              placeholder="搜索图书、作者、ISBN..."
              class="w-full py-2 px-4 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
            />
            <button
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              @click="handleSearch"
            >
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>

        <!-- 用户菜单 -->
        <div class="flex items-center space-x-6">
          <!-- 收藏和购物车 -->
          <router-link
            to="/wishlist"
            class="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors"
            :class="{ 'text-primary': $route.path === '/wishlist' }"
          >
            <i class="fa fa-heart-o text-lg"></i>
            <span class="ml-1">收藏</span>
          </router-link>
          <router-link
            to="/cart"
            class="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors"
            :class="{ 'text-primary': $route.path === '/cart' }"
          >
            <i class="fa fa-shopping-cart text-lg"></i>
            <span class="ml-1">购物车</span>
            <span
              v-if="cartItemCount > 0"
              class="ml-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- 登录状态显示 -->
          <div v-if="isLoggedIn" class="relative group">
            <button class="flex items-center text-gray-600 hover:text-primary transition-colors">
              <div class="relative w-8 h-8 mr-1">
                <img
                  :src="userAvatar"
                  :alt="userDisplayName + '的头像'"
                  class="w-full h-full rounded-full object-cover border border-gray-200"
                  @error="handleAvatarError"
                  @load="handleAvatarLoad"
                />
                <div
                  v-if="isLoadingAvatar"
                  class="absolute inset-0 bg-gray-200 rounded-full opacity-50 flex items-center justify-center"
                >
                  <i class="fa fa-circle-o-notch fa-spin text-gray-500 text-xs"></i>
                </div>
              </div>

              <span class="ml-1 hidden md:inline">{{ userDisplayName }}</span>
              <i class="fa fa-angle-down ml-1 text-xs"></i>
            </button>

            <!-- 用户下拉菜单 -->
            <div
              class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-800">
                  {{ userInfo.nickname || userInfo.username }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ userInfo.username }}
                  <span class="mx-1">|</span>
                  {{ userInfo.email || '未绑定邮箱' }}
                </p>
              </div>
              <router-link
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                @click="closeDropdown"
              >
                <i class="fa fa-user-o mr-2"></i>个人中心
              </router-link>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 text-sm"
              >
                <i class="fa fa-sign-out mr-2"></i>退出登录
              </button>
            </div>
          </div>

          <!-- 未登录状态显示 -->
          <router-link v-else to="/auth" class="text-gray-600 hover:text-primary transition-colors">
            <i class="fa fa-user-o text-lg"></i>
            <span class="ml-1 hidden md:inline">登录/注册</span>
          </router-link>
        </div>
      </div>

      <!-- 主导航菜单 -->
      <nav
        v-if="!loadingCategories"
        class="hidden md:flex items-center space-x-1 py-3 border-t border-gray-100"
      >
        <router-link
          to="/"
          class="px-3 py-2 text-gray-700 hover:text-primary transition-colors rounded-md"
          :class="{ 'text-primary font-medium bg-primary/10': $route.path === '/' }"
        >
          首页
        </router-link>
        <!-- 动态生成分类链接 -->
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="`/category/${category.slug}`"
          class="px-3 py-2 text-gray-700 hover:text-primary transition-colors rounded-md"
          :class="{
            'text-primary font-medium bg-primary/10': $route.params.category === category.slug,
          }"
        >
          {{ category.name }}
        </router-link>
      </nav>
      <!-- 加载状态 -->
      <div v-else class="hidden md:flex items-center space-x-1 py-3 border-t border-gray-100">
        <div class="px-3 py-2 text-gray-400">加载分类...</div>
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { getAvatarUrl } from '@/config'
import TopNotice from './TopNotice.vue'
import { getCategories } from '@/services/bookService' // 导入获取分类的方法

export default {
  name: 'Header',
  components: {
    TopNotice,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const cartStore = useCartStore()

    const categories = ref([])
    const loadingCategories = ref(false)
    const searchKeyword = ref('')
    const isLoadingAvatar = ref(false)
    const avatarError = ref(false)

    // 获取分类数据的方法
    const fetchCategories = async () => {
      loadingCategories.value = true
      try {
        categories.value = await getCategories()
      } catch (error) {
        console.error('Failed to fetch categories for navigation:', error)
        // 可以在这里设置一个默认的categories值，或者保持为空数组
      } finally {
        loadingCategories.value = false
      }
    }

    // 从购物车状态获取商品数量
    const cartItemCount = computed(() => {
      return cartStore.items.reduce((total, item) => total + item.quantity, 0)
    })

    // 用户信息
    const userInfo = computed(() => {
      return authStore.user || { username: '用户', nickname: '' }
    })

    // 登录状态
    const isLoggedIn = computed(() => {
      return authStore.isAuthenticated
    })

    // 用户头像处理
    const userAvatar = computed(() => {
      if (avatarError.value) {
        return generateDefaultAvatar()
      }

      if (userInfo.value.avatar_url) {
        return getAvatarUrl(userInfo.value.avatar_url)
      }

      return generateDefaultAvatar()
    })

    // 生成默认头像
    const generateDefaultAvatar = () => {
      const usernameHash = Array.from(userInfo.value.username || 'user').reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0,
      )
      return `https://picsum.photos/id/${usernameHash % 100}/200`
    }

    // 用户显示名称
    const userDisplayName = computed(() => {
      if (userInfo.value.nickname && userInfo.value.nickname.trim() !== '') {
        return userInfo.value.nickname
      }
      return userInfo.value.username || '用户'
    })

    // 头像加载处理
    const handleAvatarLoad = () => {
      isLoadingAvatar.value = false
      avatarError.value = false
    }

    const handleAvatarError = () => {
      console.log('头像加载失败，使用默认头像')
      isLoadingAvatar.value = false
      avatarError.value = true
    }

    // 搜索处理
    const handleSearch = () => {
      if (searchKeyword.value.trim()) {
        router.push({
          path: '/search',
          query: { q: searchKeyword.value.trim() },
        })
        searchKeyword.value = ''
      }
    }

    // 关闭下拉菜单
    const closeDropdown = () => {
      // 可以添加关闭动画或状态重置
    }

    // 退出登录
    const handleLogout = async () => {
      try {
        await authStore.logout()
        router.push('/')
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    }

    // 监听用户信息变化
    watch(
      () => authStore.user,
      (newUser) => {
        if (newUser && newUser.avatar_url) {
          isLoadingAvatar.value = true
          avatarError.value = false
        }
      },
      { deep: true, immediate: true },
    )

    // 初始化时检查登录状态并获取分类
    onMounted(() => {
      // 获取导航分类
      fetchCategories()

      // 检查用户登录状态
      if (authStore.isAuthenticated && (!authStore.user || !authStore.user.avatar_url)) {
        authStore.fetchUserProfile().catch((error) => {
          console.error('获取用户信息失败:', error)
        })
      }
    })

    return {
      searchKeyword,
      userInfo,
      isLoggedIn,
      userAvatar,
      userDisplayName,
      isLoadingAvatar,
      cartItemCount,
      categories,
      loadingCategories,
      handleAvatarLoad,
      handleAvatarError,
      handleSearch,
      closeDropdown,
      handleLogout,
    }
  },
}
</script>

<style scoped>
/* 激活的导航链接样式 */
.router-link-exact-active {
  @apply bg-primary/10 text-primary font-medium;
}

/* 下拉菜单动画 */
.group .absolute {
  transform-origin: top right;
  transform: scale(0.95);
  transition: all 0.2s ease-out;
}

.group:hover .absolute {
  transform: scale(1);
}
</style>
