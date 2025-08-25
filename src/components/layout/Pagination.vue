<template>
  <div class="pagination-container">
    <div class="pagination-info">
      共 {{ total }} 条记录，当前第 {{ currentPage }}/{{ totalPages }} 页
    </div>
    <div class="pagination-controls">
      <button class="pagination-btn" @click="handlePageClick(1)" :disabled="currentPage === 1">
        首页
      </button>
      <button
        class="pagination-btn"
        @click="handlePageClick(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        上一页
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        class="pagination-num"
        :class="{ active: page === currentPage }"
        @click="handlePageClick(page)"
      >
        {{ page }}
      </button>

      <button
        class="pagination-btn"
        @click="handlePageClick(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        下一页
      </button>
      <button
        class="pagination-btn"
        @click="handlePageClick(totalPages)"
        :disabled="currentPage === totalPages"
      >
        末页
      </button>

      <div class="page-size-selector">
        每页显示:
        <select v-model="localPageSize" @change="handleSizeChange" class="page-size-select">
          <option v-for="size in pageSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPages: {
      type: Number,
      required: true,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    pageSize: {
      type: Number,
      required: true,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 使用本地数据属性来绑定select
      localPageSize: this.pageSize,
    }
  },
  watch: {
    // 监听prop变化，同步到本地属性
    pageSize(newVal) {
      this.localPageSize = newVal
    },
  },
  computed: {
    // 计算显示的页码
    visiblePages() {
      const pages = []
      const total = this.totalPages
      const current = this.currentPage

      // 总页数小于等于5时，显示所有页码
      if (total <= 5) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // 总页数大于5时，显示当前页附近的页码
        if (current <= 3) {
          pages.push(1, 2, 3, 4, 5)
        } else if (current >= total - 2) {
          pages.push(total - 4, total - 3, total - 2, total - 1, total)
        } else {
          pages.push(current - 2, current - 1, current, current + 1, current + 2)
        }
      }

      return pages
    },
  },
  methods: {
    // 处理页码点击
    handlePageClick(page) {
      // 确保页码在有效范围内
      if (page < 1 || page > this.totalPages) return

      this.$emit('page-change', page)
    },
    // 处理每页条数变化
    handleSizeChange() {
      this.$emit('size-change', this.localPageSize)
    },
  },
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 5px;
}

.pagination-btn,
.pagination-num {
  padding: 5px 12px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover,
.pagination-num:hover {
  background-color: #f5f5f5;
}

.pagination-num.active {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.pagination-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f9f9f9;
}

.page-size-selector {
  margin-left: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.page-size-select {
  padding: 3px 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}
</style>
