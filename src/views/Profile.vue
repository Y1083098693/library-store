<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 通知组件 -->
    <Notification
      :visible="notification.visible"
      :type="notification.type"
      :message="notification.message"
      :title="notification.title"
      @close="hideNotification"
    />
    <!-- 主内容区 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 面包屑导航 -->
      <Breadcrumb />

      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-800">个人中心</h1>
        <p class="text-gray-600 mt-2">管理您的账户信息和订单</p>
      </div>

      <!-- 加载状态 -->
      <LoadingState v-if="isLoading" />

      <!-- 错误提示 -->
      <ErrorAlert v-if="error" :message="error" />

      <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- 侧边栏 -->
        <aside class="lg:col-span-1">
          <ProfileSidebar
            :user="authStore.user"
            :stats="stats"
            :active-tab="activeTab"
            @tab-change="activeTab = $event"
            @logout="handleLogout"
          />
        </aside>

        <!-- 主内容区 -->
        <div class="lg:col-span-3 space-y-6">
          <!-- 个人资料 -->
          <ProfileForm
            v-if="activeTab === 'profile'"
            v-model:user-form="userForm"
            :account="account"
            :is-editing="isEditing"
            :is-submitting="isSubmitting"
            @toggle-edit="isEditing = !isEditing"
            @update-profile="handleUpdateProfile"
          />

          <!-- 我的订单 -->
          <OrdersSection
            v-if="activeTab === 'orders'"
            :orders="orders"
            :active-filter="activeFilter"
            :order-status-map="orderStatusMap"
            :default-book-image="defaultBookImage"
            @filter-orders="filterOrders"
          />

          <!-- 我的收藏 -->
          <WishlistSection
            v-if="activeTab === 'wishlist'"
            :wishlist="wishlist"
            :default-book-image="defaultBookImage"
          />

          <!-- 收货地址 -->
          <AddressSection
            v-if="activeTab === 'address'"
            :addresses="addresses"
            :show-add-form="showAddAddressForm"
            :editing-address-id="editingAddressId"
            :address-form="addressForm"
            :is-loading="isAddressLoading"
            @open-add-form="openAddAddressForm"
            @close-add-form="showAddAddressForm = false"
            @save-address="saveAddress"
            @edit-address="handleEditAddress"
            @delete-address="handleDeleteAddress"
            @set-default-address="setDefaultAddress"
          />

          <!-- 账户安全 -->
          <SecuritySection
            v-if="activeTab === 'security'"
            :user-form="userForm"
            :show-change-password="showChangePasswordForm"
            :password-form="passwordForm"
            :is-loading="isPasswordLoading"
            @toggle-password-form="showChangePasswordForm = !showChangePasswordForm"
            @change-password="changePassword"
            @cancel-password-change="cancelPasswordChange"
          />
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t mt-12">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center text-gray-500 text-sm">
          <p>© 2024 小白书城 版权所有</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { watch, onMounted, ref, reactive } from 'vue'
import { userAPI } from '@/services/api' // 统一使用userAPI

// 组件导入
import Breadcrumb from '@/components/profile/Breadcrumb.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import ErrorAlert from '@/components/common/ErrorAlert.vue'
import ProfileSidebar from '@/components/profile/ProfileSidebar.vue'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import OrdersSection from '@/components/profile/OrdersSection.vue'
import WishlistSection from '@/components/profile/WishlistSection.vue'
import AddressSection from '@/components/profile/AddressSection.vue'
import SecuritySection from '@/components/profile/SecuritySection.vue'
import Notification from '@/components/common/Notification.vue'

export default {
  name: 'Profile',
  components: {
    Notification,
    Breadcrumb,
    LoadingState,
    ErrorAlert,
    ProfileSidebar,
    ProfileForm,
    OrdersSection,
    WishlistSection,
    AddressSection,
    SecuritySection,
  },
  setup() {
    // 使用Vue3的Composition API重构状态管理
    const authStore = useAuthStore()
    const router = useRouter()
    const isLoading = ref(true)
    const error = ref(null)
    const isEditing = ref(false)
    const isSubmitting = ref(false)
    const isAddressLoading = ref(false)
    const isPasswordLoading = ref(false)
    const isDebug = ref(true) // 开发环境调试用，生产环境可设为false
    const notification = reactive({
      visible: false,
      type: 'info', // success, error, info, warning
      title: '',
      message: '',
    })
    // 显示通知的方法
    const showNotification = (type, message, title = '') => {
      notification.type = type
      notification.message = message
      notification.title = title
      notification.visible = true
    }
    // 隐藏通知的方法
    const hideNotification = () => {
      notification.visible = false
    }

    // 用户数据相关
    const account = ref('')
    const userForm = reactive({
      nickname: '',
      email: '',
      phone: '',
      bio: '',
      username: '', // 添加username字段
    })

    // 其他状态
    const activeTab = ref('profile')
    const stats = reactive({
      orders: 0,
      wishlist: 0,
      unpaidpaid: 0,
    })

    const orders = ref([])
    const activeFilter = ref('all')
    const currentPage = ref(1)
    const pageSize = ref(5)

    const wishlist = ref([])

    const addresses = ref([])
    const showAddAddressForm = ref(false)
    const editingAddressId = ref(null)
    const addressForm = reactive({
      receiver: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false,
    })

    const showChangePasswordForm = ref(false)
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })

    const defaultAvatar = 'https://picsum.photos/id/64/200'
    const defaultBookImage = 'https://picsum.photos/id/24/200/300'

    // 监听认证状态变化
    watch(
      () => authStore.isAuthenticated,
      (isAuthenticated) => {
        if (!isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
          router.push('/auth?redirect=' + encodeURIComponent(router.currentRoute.value.fullPath))
        }
      },
    )

    // 初始化数据加载
    const initData = async () => {
      if (!authStore.isAuthenticated) {
        console.log('❌ 未认证，跳转到登录页')
        router.push('/auth?redirect=/profile')
        return
      }

      try {
        console.log('📋 开始加载个人中心数据...')
        // 并行加载所有数据
        await Promise.all([
          fetchUserProfile(),
          fetchOrders(),
          fetchWishlist(),
          fetchAddresses(),
          fetchUserStats(),
        ])
        console.log('✅ 个人中心数据加载完成')
      } catch (err) {
        console.error('❌ 加载个人中心数据失败:', err)
        error.value = err.message || '加载个人中心数据失败'
        // 只在明确是无效token时才跳转
        if (err.message === '无效的token') {
          router.push('/auth?redirect=/profile')
        }
      } finally {
        isLoading.value = false
      }
    }
    // 保存原始用户数据用于比较
    const originalUserData = ref({})
    // 获取用户信息，保存原始数据
    const fetchUserProfile = async () => {
      try {
        console.log('🔍 开始获取用户信息 (/users/profile)')
        const startTime = Date.now()

        const data = await userAPI.getProfile()

        console.log(`📥 请求耗时: ${Date.now() - startTime}ms`)
        console.log('📦 后端返回的完整数据:', JSON.stringify(data, null, 2))

        if (!data) {
          throw new Error('后端未返回用户数据')
        }

        console.log('🔍 检查id字段:', {
          exists: 'id' in data,
          value: data.id,
          type: typeof data.id,
        })

        if (data.id === undefined || data.id === null) {
          throw new Error('用户数据缺少id字段')
        }

        // 保存原始数据用于后续比较
        originalUserData.value = {
          nickname: data.nickname || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          username: data.username || '',
        }

        // 更新表单数据
        account.value = data.username || '未知用户'
        userForm.nickname = data.nickname || ''
        userForm.email = data.email || ''
        userForm.phone = data.phone || ''
        userForm.bio = data.bio || ''
        userForm.username = data.username || ''

        console.log('✅ 用户信息加载成功')
      } catch (err) {
        console.error('❌ 获取用户信息失败:', err)
        throw err
      }
    }
    // 获取订单列表
    const fetchOrders = async () => {
      try {
        console.log('🔍 获取订单列表 (/users/orders)')
        const data = await userAPI.getOrders(activeFilter.value)
        orders.value = data.orders || []
      } catch (err) {
        console.error('❌ 获取订单失败:', err)
        throw new Error('获取订单失败: ' + err.message)
      }
    }

    // 订单筛选
    const filterOrders = (status) => {
      activeFilter.value = status
      currentPage.value = 1
      fetchOrders()
    }

    // 获取收藏列表
    const fetchWishlist = async () => {
      try {
        console.log('🔍 获取收藏列表 (/users/wishlist)')
        const data = await userAPI.getWishlist()
        wishlist.value = data.items || []
      } catch (err) {
        console.error('❌ 获取收藏失败:', err)
        throw new Error('获取收藏失败: ' + err.message)
      }
    }

    // 获取地址列表
    const fetchAddresses = async () => {
      try {
        console.log('🔍 获取地址列表 (/users/addresses)')
        const data = await userAPI.getAddresses()
        addresses.value = data || []
      } catch (err) {
        console.error('❌ 获取地址失败:', err)
        throw new Error('获取地址失败: ' + err.message)
      }
    }

    // 获取用户统计
    const fetchUserStats = async () => {
      try {
        console.log('🔍 获取用户统计 (/users/stats)')
        const data = await userAPI.getStats()
        stats.orders = data.totalOrders || 0
        stats.wishlist = data.wishlistCount || 0
        stats.unpaidpaid = data.unpaidOrders || 0
      } catch (err) {
        console.error('❌ 获取统计失败:', err)
        throw new Error('获取统计失败: ' + err.message)
      }
    }

    // 更新个人资料
    const updateProfile = async () => {
      try {
        console.log('原始数据:', JSON.stringify(originalUserData.value))
        console.log('表单数据:', JSON.stringify(userForm))
        // 前端先检测是否有实际变更
        const hasChanges = checkForChanges(userForm, originalUserData.value)
        console.log('是否有变更:', hasChanges)
        if (!hasChanges) {
          alert('未检测到任何变更，请修改后再保存')
          isSubmitting.value = false
          return
        }

        isSubmitting.value = true
        console.log('正在保存修改...')

        // 只提交可以修改的字段
        const updateData = {
          nickname: userForm.nickname || null,
          email: userForm.email || null,
          phone: userForm.phone || null,
          bio: userForm.bio || null,
        }

        // 过滤掉所有空字符串，统一使用null
        Object.keys(updateData).forEach((key) => {
          if (updateData[key] === '') {
            updateData[key] = null
          }
        })

        console.log('提交的更新数据:', updateData)

        // 发送更新请求并获取完整响应
        const response = await userAPI.updateProfile(updateData)
        console.log('更新响应结果:', response)

        // 更灵活的成功判断逻辑 - 同时考虑affectedRows和success标志
        const isSuccess = response && response.id && response.nickname

        if (isSuccess) {
          // 重新获取用户信息以更新本地数据
          await fetchUserProfile()
          isEditing.value = false

          // 检查关键信息是否变更
          const criticalFieldsChanged = checkCriticalFieldsChanged()
          if (criticalFieldsChanged) {
            showNotification('success', '个人资料更新成功，需要重新登录', '更新成功')
            // 延迟 logout 以确保用户看到通知
            setTimeout(handleLogout, 1500)
          } else {
            showNotification('success', '个人资料更新成功！', '更新成功')
          }
        } else {
          // 即使后端返回了结果，但标记为失败的情况
          throw new Error(response?.message || '更新失败，请稍后重试')
        }
      } catch (err) {
        console.error('更新个人资料失败:', err)
        let errorMessage = '更新个人资料失败'
        if (err.message) {
          errorMessage += ': ' + err.message
        } else if (err.response && err.response.data && err.response.data.message) {
          errorMessage += ': ' + err.response.data.message
        }
        // 显示错误通知
        showNotification('error', errorMessage, '更新失败')
        error.value = errorMessage
      } finally {
        isSubmitting.value = false
      }
    }
    // 修改updateProfile方法
    const handleUpdateProfile = (updatedFormData) => {
      // 将子组件传递过来的数据合并到userForm中
      Object.assign(userForm, updatedFormData)
      updateProfile() // 调用原有的保存逻辑
    }

    // 修复后的变更检测函数
    const checkForChanges = (currentForm, originalData) => {
      // 定义需要比较的字段
      const editableFields = ['nickname', 'email', 'phone', 'bio']

      for (const field of editableFields) {
        if (currentForm[field] !== originalData[field]) {
          console.log(`检测到变更 - ${field}:`, {
            原值: originalUserData.value[field],
            新值: userForm[field],
          })
          return true
        }
      }

      console.log('所有可编辑字段均未变更')
      return false
    }
    // 检查关键信息是否变更
    const checkCriticalFieldsChanged = () => {
      const originalUser = authStore.user
      // 只检查邮箱，因为用户名是不可修改的
      return originalUser.email !== userForm.email
    }

    // 退出登录
    const handleLogout = () => {
      try {
        authStore.logout()
        router.push('/login')
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } catch (error) {
        console.error('退出登录失败:', error)
        alert('退出登录失败，请重试')
      }
    }

    // 地址管理相关方法
    const openAddAddressForm = () => {
      showAddAddressForm.value = true
      editingAddressId.value = null
      resetAddressForm()
    }

    const resetAddressForm = () => {
      addressForm.receiver = ''
      addressForm.phone = ''
      addressForm.province = ''
      addressForm.city = ''
      addressForm.district = ''
      addressForm.detail = ''
      addressForm.isDefault = false
    }

    const handleEditAddress = (address) => {
      editingAddressId.value = address.id
      Object.assign(addressForm, address)
      showAddAddressForm.value = true
    }

    const saveAddress = async () => {
      try {
        isAddressLoading.value = true

        if (editingAddressId.value) {
          await userAPI.updateAddress(editingAddressId.value, addressForm)
        } else {
          await userAPI.addAddress(addressForm)
        }

        showAddAddressForm.value = false
        resetAddressForm()
        await fetchAddresses()
        showNotification('success', '地址保存成功！', '操作成功')
      } catch (err) {
        console.error('保存地址失败:', err)
        showNotification('error', err.message || '保存地址失败，请重试', '操作失败')
      } finally {
        isAddressLoading.value = false
      }
    }

    const handleDeleteAddress = async (id) => {
      if (!confirm('确定要删除这个地址吗？')) return

      try {
        isAddressLoading.value = true
        await userAPI.deleteAddress(id)
        await fetchAddresses()
        showNotification('success', '地址删除成功！')
      } catch (err) {
        console.error('删除地址失败:', err)
        showNotification('error', err.message || '地址删除失败，请重试', '操作失败')
      } finally {
        isAddressLoading.value = false
      }
    }

    const setDefaultAddress = async (id) => {
      try {
        isAddressLoading.value = true
        await userAPI.setDefaultAddress(id)
        await fetchAddresses()
        showNotification('success', '设置默认地址成功！')
      } catch (err) {
        console.error('设置默认地址失败:', err)
        showNotification('error', err.message || '默认地址设置失败，请重试', '操作失败')
      } finally {
        isAddressLoading.value = false
      }
    }

    // 密码修改相关方法
    const resetPasswordForm = () => {
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }

    const cancelPasswordChange = () => {
      showChangePasswordForm.value = false
      resetPasswordForm()
    }

    const changePassword = async () => {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        showNotification('error', '两次输入的密码不一致')
        return
      }

      try {
        isPasswordLoading.value = true
        await userAPI.changePassword(passwordForm)
        showChangePasswordForm.value = false
        resetPasswordForm()
        alert('密码修改成功，请重新登录')
        showNotification('success', '密码修改成功！', '请重新登陆')
        handleLogout()
      } catch (err) {
        console.error('修改密码失败:', err)
        showNotification('error', err.message || '密码修改失败，请重试', '操作失败')
      } finally {
        isPasswordLoading.value = false
      }
    }

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    // 页面挂载时初始化数据
    onMounted(initData)

    // 计算属性
    const orderStatusMap = {
      pending: '待付款',
      paid: '已付款',
      shipped: '已发货',
      completed: '已完成',
      cancelled: '已取消',
    }

    const filteredOrders = () => {
      if (activeFilter.value === 'all') {
        return orders.value
      }
      return orders.value.filter((order) => order.status === activeFilter.value)
    }

    const totalPages = () => {
      return Math.ceil(filteredOrders().length / pageSize.value)
    }

    // 暴露给模板使用的变量和方法
    return {
      authStore,
      router,
      activeTab,
      isLoading,
      error,
      isEditing,
      isSubmitting,
      isAddressLoading,
      isPasswordLoading,
      isDebug,
      stats,
      account,
      userForm,
      orders,
      activeFilter,
      currentPage,
      pageSize,
      wishlist,
      addresses,
      showAddAddressForm,
      editingAddressId,
      addressForm,
      showChangePasswordForm,
      passwordForm,
      defaultAvatar,
      defaultBookImage,
      orderStatusMap,
      filteredOrders,
      totalPages,
      formatDate,
      openAddAddressForm,
      resetAddressForm,
      fetchUserProfile,
      fetchOrders,
      filterOrders,
      fetchWishlist,
      fetchAddresses,
      fetchUserStats,
      updateProfile,
      checkCriticalFieldsChanged,
      handleLogout,
      handleEditAddress,
      saveAddress,
      handleDeleteAddress,
      setDefaultAddress,
      resetPasswordForm,
      cancelPasswordChange,
      changePassword,
      handleUpdateProfile,
      notification,
      showNotification,
      hideNotification,
    }
  },
}
</script>

<style scoped>
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

/* 通用样式 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.overflow-hidden {
  overflow: hidden !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .h-32 {
    height: 28px;
  }

  .-mt-16 {
    margin-top: -14rem;
  }
}
</style>
