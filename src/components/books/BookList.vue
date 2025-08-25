<template>
  <div class="book-library">
    <h2>图书列表</h2>

    <!-- 搜索和筛选区域 -->
    <div class="filters">
      <input type="text" v-model="searchQuery" placeholder="搜索图书..." class="search-input" />
      <select v-model="selectedCategory" class="category-select">
        <option value="">全部分类</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <!-- 图书列表 -->
    <div class="books-grid">
      <div v-for="book in paginatedBooks" :key="book.id" class="book-card">
        <!-- 图书图片 -->
        <div class="book-image">
          <img :src="book.imageUrl" :alt="book.title" @error="handleImageError($event)" />
        </div>

        <!-- 图书信息 -->
        <div class="book-info">
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">作者: {{ book.author }}</p>
          <p class="book-category">分类: {{ book.category }}</p>
          <p class="book-price">价格: ¥{{ book.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <Pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
import Pagination from './Pagination.vue'

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      // 图书数据 - 新增imageUrl字段
      books: [
        {
          id: 1,
          title: 'JavaScript高级程序设计',
          author: '尼古olas C. Zakas',
          category: '编程',
          price: 129.0,
          imageUrl:
            'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/6b7da6387a904d83bb8e88da9386600e.png~tplv-a9rns2rl98-24:720:720.png',
        },
        {
          id: 2,
          title: '设计模式：可复用面向对象软件的基础',
          author: 'Erich Gamma',
          category: '编程',
          price: 89.0,
          imageUrl:
            'https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/90c60eacc00a43a696d20cc1fb0e5a0e.png~tplv-a9rns2rl98-24:720:720.png',
        },
        {
          id: 3,
          title: '计算机网络（第7版）',
          author: '谢希仁',
          category: '计算机基础',
          price: 65.0,
          imageUrl:
            'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/040807b306b346f5be977eab648cdc1d.png~tplv-a9rns2rl98-24:720:720.png',
        },
        // 可以继续添加更多图书...
      ],
      searchQuery: '',
      selectedCategory: '',
      currentPage: 1,
      pageSize: 10,
    }
  },
  computed: {
    // 筛选后的图书
    filteredBooks() {
      return this.books.filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesCategory = !this.selectedCategory || book.category === this.selectedCategory
        return matchesSearch && matchCategory
      })
    },
    // 分页后的图书
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.pageSize
      return this.filteredBooks.slice(startIndex, startIndex + this.pageSize)
    },
    // 总页数
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.pageSize)
    },
    // 所有分类
    categories() {
      const categories = new Set()
      this.books.forEach((book) => categories.add(book.category))
      return Array.from(categories)
    },
  },
  methods: {
    // 处理页码变化
    handlePageChange(page) {
      this.currentPage = page
    },
    // 处理每页条数变化
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1 // 重置到第一页
    },
    // 图片加载失败时的处理
    handleImageError(event) {
      // 可以设置一个默认图片
      event.target.src = 'https://picsum.photos/200/300?grayscale&blur=2'
    },
  },
}
</script>

<style scoped>
.book-library {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.category-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.book-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.book-image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
}

.book-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  padding: 10px;
}

.book-info {
  padding: 15px;
}

.book-title {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  color: #333;
}

.book-author,
.book-category,
.book-price {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.book-price {
  color: #e53e3e;
  font-weight: bold;
}
</style>
