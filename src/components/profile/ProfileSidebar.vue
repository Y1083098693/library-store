<template>
  <!-- 添加v-if判断user是否存在 -->
  <div
    v-if="user"
    class="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24 border border-gray-100"
  >
    <!-- 个人信息卡片顶部背景层 -->
    <div class="h-44 relative overflow-hidden">
      <img
        src="https://dy.ssrla.de/theme/cool/assets/images/user-info.jpg"
        alt="个人资料背景图"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent scale-155"></div>
    </div>

    <!-- 个人信息概览 -->
    <div class="p-6 border-b -mt-12 relative z-10">
      <div class="flex flex-col items-center">
        <div class="relative mb-4">
          <AvatarUploader
            :current-avatar="user.avatar"
            :default-avatar="defaultAvatar"
            @onSuccess="handleAvatarUpdated"
          />
        </div>
        <h3 class="text-xl font-semibold text-gray-800">
          {{ user.username || '未设置用户名' }}
        </h3>
        <p class="text-gray-500 text-sm mt-1 px-3 py-1 bg-gray-100 rounded-full">
          会员等级：{{ userLevel }}
        </p>

        <div class="flex justify-center mt-6 space-x-6 w-full pt-4 border-t border-gray-100">
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ stats.orders }}</p>
            <p class="text-gray-500 text-sm">订单总数</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-primary">{{ stats.wishlist }}</p>
            <p class="text-gray-500 text-sm">收藏图书</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="p-2">
      <button
        @click="$emit('tab-change', 'profile')"
        class="w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200"
        :class="
          activeTab === 'profile'
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        "
      >
        <i class="fa fa-user-o w-5 text-center mr-3"></i>
        <span>个人资料</span>
      </button>

      <button
        @click="$emit('tab-change', 'orders')"
        class="w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200"
        :class="
          activeTab === 'orders'
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        "
      >
        <i class="fa fa-list-alt w-5 text-center mr-3"></i>
        <span>我的订单</span>
        <span
          v-if="stats.unpaid > 0"
          class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
        >
          {{ stats.unpaid }}
        </span>
      </button>

      <button
        @click="$emit('tab-change', 'wishlist')"
        class="w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200"
        :class="
          activeTab === 'wishlist'
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        "
      >
        <i class="fa fa-heart-o w-5 text-center mr-3"></i>
        <span>我的收藏</span>
      </button>

      <button
        @click="$emit('tab-change', 'address')"
        class="w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200"
        :class="
          activeTab === 'address'
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        "
      >
        <i class="fa fa-map-marker w-5 text-center mr-3"></i>
        <span>收货地址</span>
      </button>

      <!-- 修复账户安全入口，点击切换到安全标签 -->
      <button
        @click="$emit('tab-change', 'security')"
        class="w-full text-left px-4 py-3 rounded-lg flex items-center transition-all duration-200"
        :class="
          activeTab === 'security'
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        "
      >
        <i class="fa fa-shield w-5 text-center mr-3"></i>
        <span>账户安全</span>
      </button>

      <button
        @click="$emit('logout')"
        class="w-full text-left px-4 py-3 rounded-lg flex items-center text-red-600 hover:bg-red-50 mt-2 transition-all duration-200"
      >
        <i class="fa fa-sign-out w-5 text-center mr-3"></i>
        <span>退出登录</span>
      </button>
    </nav>
  </div>
  <!-- 当user为null时显示空内容或登录提示 -->
  <div v-else></div>
</template>

<script>
import AvatarUploader from '@/components/common/AvatarUploader.vue'

export default {
  name: 'ProfileSidebar',
  components: {
    AvatarUploader,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
    stats: {
      type: Object,
      required: true,
    },
    activeTab: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      defaultAvatar: 'https://dy.ssrla.de/theme/cool/assets/images/images.png',
    }
  },
  computed: {
    userLevel() {
      // 确保stats存在再访问其属性
      if (!this.stats) return '普通会员'
      if (this.stats.orders >= 50) return '钻石会员'
      if (this.stats.orders >= 20) return '黄金会员'
      if (this.stats.orders >= 5) return '白银会员'
      return '普通会员'
    },
  },
  methods: {
    handleAvatarUpdated(newAvatarUrl) {
      // 先检查user是否存在
      if (this.user) {
        this.user.avatar = newAvatarUrl
      }
    },
  },
}
</script>
