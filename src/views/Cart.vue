<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面标题 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl font-bold text-gray-800">购物车</h1>
        <p class="text-gray-500 mt-1">您选购的图书和结算信息</p>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="container mx-auto px-4 py-8">
      <!-- 空状态 -->
      <div v-if="cartItems.length === 0" class="bg-white rounded-lg shadow-sm p-8 text-center">
        <div class="w-24 h-24 mx-auto mb-4 text-gray-300">
          <i class="fa fa-shopping-cart text-6xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">您的购物车是空的</h3>
        <p class="text-gray-500 mb-6">快去挑选心仪的图书吧</p>
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <i class="fa fa-book mr-2"></i> 浏览图书
        </router-link>
      </div>

      <!-- 购物车列表 -->
      <div v-else class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- 购物车表头 -->
        <div
          class="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 text-sm font-medium text-gray-500"
        >
          <div class="col-span-5">商品信息</div>
          <div class="col-span-2 text-center">单价</div>
          <div class="col-span-2 text-center">数量</div>
          <div class="col-span-2 text-center">小计</div>
          <div class="col-span-1 text-center">操作</div>
        </div>

        <!-- 购物车项目 -->
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center"
        >
          <!-- 商品信息 -->
          <div class="col-span-12 md:col-span-5 flex items-center">
            <router-link to="/book/detail" class="w-20 h-28 flex-shrink-0">
              <img
                :src="item.imageUrl"
                :alt="item.title"
                class="w-full h-full object-cover rounded"
              />
            </router-link>
            <div class="ml-4 flex-1">
              <router-link
                to="/book/detail"
                class="block text-gray-900 font-medium hover:text-primary transition-colors"
              >
                {{ item.title }}
              </router-link>
              <p class="text-gray-500 text-sm mt-1">{{ item.author }}</p>
            </div>
          </div>

          <!-- 单价 -->
          <div class="col-span-4 md:col-span-2 py-2 md:py-0 md:text-center">
            <span class="text-gray-900 font-medium">¥{{ item.price.toFixed(2) }}</span>
          </div>

          <!-- 数量 -->
          <div class="col-span-4 md:col-span-2 py-2 md:py-0 flex justify-center">
            <div class="flex items-center border border-gray-300 rounded-md w-28">
              <button
                @click="decreaseQuantity(item.id)"
                class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                :disabled="item.quantity <= 1"
              >
                <i class="fa fa-minus text-xs"></i>
              </button>
              <input
                type="number"
                v-model="item.quantity"
                class="w-12 h-8 text-center border-none focus:outline-none"
                min="1"
                @change="validateQuantity(item)"
              />
              <button
                @click="increaseQuantity(item.id)"
                class="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <i class="fa fa-plus text-xs"></i>
              </button>
            </div>
          </div>

          <!-- 小计 -->
          <div class="col-span-4 md:col-span-2 py-2 md:py-0 md:text-center">
            <span class="text-primary font-medium"
              >¥{{ (item.price * item.quantity).toFixed(2) }}</span
            >
          </div>

          <!-- 操作 -->
          <div class="col-span-12 md:col-span-1 py-2 md:py-0 flex justify-center md:justify-end">
            <button
              @click="removeFromCart(item.id)"
              class="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="删除"
            >
              <i class="fa fa-trash-o"></i>
              <span class="ml-1 hidden md:inline">删除</span>
            </button>
          </div>
        </div>

        <!-- 结算区域 -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-4 md:mb-0">
              <button
                @click="clearCart"
                class="text-gray-600 hover:text-red-500 transition-colors text-sm"
              >
                <i class="fa fa-trash mr-1"></i> 清空购物车
              </button>
            </div>
            <div class="w-full md:w-auto">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-600">合计:</span>
                <span class="text-xl font-bold text-primary ml-4"
                  >¥{{ totalPrice.toFixed(2) }}</span
                >
              </div>
              <p class="text-gray-500 text-sm mb-4">共 {{ totalItems }} 件商品</p>
              <button
                @click="checkout"
                class="w-full md:w-auto px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                去结算
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '@/components/layout/Footer.vue'

export default {
  name: 'Cart',
  components: {
    Footer,
  },
  setup() {
    const router = useRouter()

    // 模拟购物车数据
    const cartItems = ref([
      {
        id: 1,
        title: '人类简史：从动物到上帝',
        author: '尤瓦尔·赫拉利',
        imageUrl: 'https://picsum.photos/id/24/200/300',
        price: 68.0,
        quantity: 1,
      },
      {
        id: 2,
        title: '活着',
        author: '余华',
        imageUrl: 'https://picsum.photos/id/21/200/300',
        price: 32.0,
        quantity: 2,
      },
    ])

    // 计算总价
    const totalPrice = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    // 计算总数量
    const totalItems = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    // 减少数量
    const decreaseQuantity = (id) => {
      const item = cartItems.value.find((item) => item.id === id)
      if (item && item.quantity > 1) {
        item.quantity--
      }
    }

    // 增加数量
    const increaseQuantity = (id) => {
      const item = cartItems.value.find((item) => item.id === id)
      if (item) {
        item.quantity++
      }
    }

    // 验证数量输入
    const validateQuantity = (item) => {
      if (isNaN(item.quantity) || item.quantity < 1) {
        item.quantity = 1
      }
    }

    // 从购物车移除
    const removeFromCart = (id) => {
      cartItems.value = cartItems.value.filter((item) => item.id !== id)
    }

    // 清空购物车
    const clearCart = () => {
      if (confirm('确定要清空购物车吗？')) {
        cartItems.value = []
      }
    }

    // 结算
    const checkout = () => {
      // 这里可以添加结算逻辑
      console.log('去结算，商品:', cartItems.value)
      alert('跳转到结算页面')
    }

    return {
      cartItems,
      totalPrice,
      totalItems,
      decreaseQuantity,
      increaseQuantity,
      validateQuantity,
      removeFromCart,
      clearCart,
      checkout,
    }
  },
}
</script>

<style scoped>
/* 可以添加额外的样式 */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
