<template>
  <section class="bg-white rounded-xl shadow-sm p-6 lg:p-8 border border-gray-100">
    <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
      <h3 class="text-xl font-semibold text-gray-800">我的订单</h3>
      <div class="flex flex-wrap gap-2">
        <button
          :class="activeStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'"
          class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          @click="changeStatus('all')"
        >
          全部
        </button>
        <button
          :class="
            activeStatus === 'pending' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          "
          class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          @click="changeStatus('pending')"
        >
          待付款
        </button>
        <button
          :class="
            activeStatus === 'shipped' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          "
          class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          @click="changeStatus('shipped')"
        >
          已发货
        </button>
        <button
          :class="
            activeStatus === 'completed' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
          "
          class="px-4 py-1.5 rounded-lg text-sm transition-colors"
          @click="changeStatus('completed')"
        >
          已完成
        </button>
      </div>
    </div>

    <div class="orders-list space-y-4">
      <div
        class="order-item border border-gray-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
        v-for="order in orders"
        :key="order.id"
      >
        <div class="order-header bg-gray-50 p-4 flex flex-wrap justify-between items-center gap-2">
          <div>
            <span class="font-medium">订单编号：{{ order.order_number }}</span>
            <span class="ml-4 text-gray-600">创建时间：{{ formatDate(order.created_at) }}</span>
          </div>
          <span :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
        </div>

        <div class="order-items p-4">
          <div
            class="flex items-center py-3 border-b border-gray-100"
            v-for="item in order.items"
            :key="item.id"
          >
            <img
              :src="item.book_cover || defaultBookImage"
              alt="图书封面"
              class="w-16 h-24 object-cover mr-4 rounded"
            />
            <div class="flex-1">
              <h4 class="font-medium">{{ item.book_title }}</h4>
              <p class="text-gray-600 text-sm">单价：¥{{ item.price }}</p>
              <p class="text-gray-600 text-sm">数量：{{ item.quantity }}</p>
            </div>
          </div>
        </div>

        <div class="order-footer p-4 flex flex-wrap justify-between items-center gap-3">
          <div class="text-lg font-medium">总计：¥{{ order.final_amount }}</div>
          <div>
            <button
              class="bg-primary text-white px-4 py-1.5 rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination flex justify-center mt-8" v-if="total > 0">
      <button
        class="px-3 py-1.5 border border-gray-300 rounded-l-lg hover:bg-gray-50 transition-colors"
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        上一页
      </button>
      <span class="px-3 py-1.5 border-t border-b border-gray-300 bg-gray-50">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </span>
      <button
        class="px-3 py-1.5 border border-gray-300 rounded-r-lg hover:bg-gray-50 transition-colors"
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
    </div>

    <div class="empty-state text-center py-16" v-if="orders.length === 0 && !isLoading">
      <i class="fa fa-box text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500">暂无订单记录</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'OrdersSection',
  props: {
    orders: {
      type: Array,
      default: () => [],
    },
    total: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    limit: {
      type: Number,
      default: 5,
    },
    activeStatus: {
      type: String,
      default: 'all',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    defaultBookImage: {
      type: String,
      default: 'https://picsum.photos/id/24/200/300',
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.limit)
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleString()
    },
    getStatusText(status) {
      const statusMap = {
        pending: '待付款',
        paid: '已付款',
        shipped: '已发货',
        completed: '已完成',
        cancelled: '已取消',
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        pending: 'text-orange-500',
        paid: 'text-blue-500',
        shipped: 'text-purple-500',
        completed: 'text-green-500',
        cancelled: 'text-gray-500',
      }
      return `font-medium ${classMap[status] || 'text-gray-700'}`
    },
    changeStatus(status) {
      this.$emit('change-status', status)
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('change-page', page)
      }
    },
  },
}
</script>
