// 模拟图书数据服务
export const bookService = {
  // 获取首页图书数据
  async getHomeBooks() {
    // 模拟API请求延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟返回数据
    return {
      newBooks: [
        {
          id: 1,
          title: '人类简史：从动物到上帝',
          author: '[以色列] 尤瓦尔·赫拉利',
          coverUrl: 'https://picsum.photos/300/400?random=1',
          price: 68.0,
          originalPrice: 88.0,
          isNew: true,
          isBestseller: true,
          discount: 7.7,
          isFavorite: false,
        },
        {
          id: 2,
          title: '未来简史',
          author: '[以色列] 尤瓦尔·赫拉利',
          coverUrl: 'https://picsum.photos/300/400?random=2',
          price: 63.0,
          originalPrice: 88.0,
          isNew: true,
          isBestseller: false,
          discount: 7.2,
          isFavorite: false,
        },
        {
          id: 3,
          title: '今日简史',
          author: '[以色列] 尤瓦尔·赫拉利',
          coverUrl: 'https://picsum.photos/300/400?random=3',
          price: 59.0,
          originalPrice: 79.0,
          isNew: true,
          isBestseller: false,
          discount: 7.5,
          isFavorite: true,
        },
        {
          id: 4,
          title: '解忧杂货店',
          author: '[日] 东野圭吾',
          coverUrl: 'https://picsum.photos/300/400?random=4',
          price: 39.5,
          originalPrice: 59.5,
          isNew: true,
          isBestseller: true,
          discount: 6.6,
          isFavorite: false,
        },
        {
          id: 5,
          title: '活着',
          author: '余华',
          coverUrl: 'https://picsum.photos/300/400?random=5',
          price: 28.0,
          originalPrice: 39.5,
          isNew: false,
          isBestseller: true,
          discount: 7.1,
          isFavorite: false,
        },
        {
          id: 6,
          title: '三体',
          author: '刘慈欣',
          coverUrl: 'https://picsum.photos/300/400?random=6',
          price: 58.0,
          originalPrice: 88.0,
          isNew: false,
          isBestseller: true,
          discount: 6.6,
          isFavorite: true,
        },
      ],
      bestSellers: [
        {
          id: 7,
          title: '百年孤独',
          author: '[哥伦比亚] 加西亚·马尔克斯',
          coverUrl: 'https://picsum.photos/300/400?random=7',
          price: 49.5,
          originalPrice: 69.0,
          isNew: false,
          isBestseller: true,
          discount: 7.2,
          isFavorite: false,
        },
        {
          id: 8,
          title: '追风筝的人',
          author: '[美] 卡勒德·胡赛尼',
          coverUrl: 'https://picsum.photos/300/400?random=8',
          price: 36.0,
          originalPrice: 49.8,
          isNew: false,
          isBestseller: true,
          discount: 7.2,
          isFavorite: false,
        },
        {
          id: 9,
          title: '小王子',
          author: '[法] 安托万·德·圣-埃克苏佩里',
          coverUrl: 'https://picsum.photos/300/400?random=9',
          price: 22.0,
          originalPrice: 32.0,
          isNew: false,
          isBestseller: true,
          discount: 6.9,
          isFavorite: true,
        },
        {
          id: 10,
          title: '月亮与六便士',
          author: '[英] 毛姆',
          coverUrl: 'https://picsum.photos/300/400?random=10',
          price: 29.0,
          originalPrice: 42.0,
          isNew: false,
          isBestseller: true,
          discount: 6.9,
          isFavorite: false,
        },
        {
          id: 11,
          title: '哈利·波特与魔法石',
          author: '[英] J.K.罗琳',
          coverUrl: 'https://picsum.photos/300/400?random=11',
          price: 59.0,
          originalPrice: 69.0,
          isNew: false,
          isBestseller: true,
          discount: 8.6,
          isFavorite: false,
        },
        {
          id: 12,
          title: '围城',
          author: '钱钟书',
          coverUrl: 'https://picsum.photos/300/400?random=12',
          price: 37.0,
          originalPrice: 47.0,
          isNew: false,
          isBestseller: true,
          discount: 7.9,
          isFavorite: false,
        },
      ],
      recommended: [
        {
          id: 13,
          title: '明朝那些事儿',
          author: '当年明月',
          coverUrl: 'https://picsum.photos/300/400?random=13',
          price: 208.0,
          originalPrice: 297.0,
          isNew: false,
          isBestseller: true,
          discount: 7.0,
          isFavorite: false,
        },
        {
          id: 14,
          title: '我们仨',
          author: '杨绛',
          coverUrl: 'https://picsum.photos/300/400?random=14',
          price: 19.5,
          originalPrice: 28.0,
          isNew: false,
          isBestseller: false,
          discount: 7.0,
          isFavorite: true,
        },
        {
          id: 15,
          title: '白夜行',
          author: '[日] 东野圭吾',
          coverUrl: 'https://picsum.photos/300/400?random=15',
          price: 59.6,
          originalPrice: 89.0,
          isNew: false,
          isBestseller: true,
          discount: 6.7,
          isFavorite: false,
        },
        {
          id: 16,
          title: '嫌疑人X的献身',
          author: '[日] 东野圭吾',
          coverUrl: 'https://picsum.photos/300/400?random=16',
          price: 35.0,
          originalPrice: 53.0,
          isNew: false,
          isBestseller: true,
          discount: 6.6,
          isFavorite: false,
        },
        {
          id: 17,
          title: '万历十五年',
          author: '[美] 黄仁宇',
          coverUrl: 'https://picsum.photos/300/400?random=17',
          price: 26.0,
          originalPrice: 39.5,
          isNew: false,
          isBestseller: false,
          discount: 6.6,
          isFavorite: false,
        },
        {
          id: 18,
          title: '红楼梦',
          author: '曹雪芹',
          coverUrl: 'https://picsum.photos/300/400?random=18',
          price: 69.8,
          originalPrice: 99.8,
          isNew: false,
          isBestseller: true,
          discount: 7.0,
          isFavorite: true,
        },
      ],
    }
  },

  // 获取图书详情
  async getBookDetail(id) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟图书详情数据
    return {
      id: id,
      title: '人类简史：从动物到上帝',
      author: '[以色列] 尤瓦尔·赫拉利',
      translator: '林俊宏',
      publisher: '中信出版社',
      publishDate: '2014-11',
      pages: 452,
      isbn: '9787508647357',
      coverUrl: 'https://picsum.photos/500/700?random=1',
      price: 68.0,
      originalPrice: 88.0,
      discount: 7.7,
      isNew: true,
      isBestseller: true,
      category: '历史',
      description:
        '《人类简史》是以色列历史学家尤瓦尔·赫拉利的重磅作品，讲述了人类如何从一个普通的非洲灵长类动物，一步步成为地球的主宰。作者以宏大的视角，从认知革命、农业革命到科学革命，重新解读了人类历史的发展进程，提出了许多颠覆传统认知的观点。',
      目录: [
        '第一部分：认知革命',
        '第二部分：农业革命',
        '第三部分：人类的融合统一',
        '第四部分：科学革命',
        '后记：变成神的这种动物',
      ],
      authorIntro:
        '尤瓦尔·赫拉利，1976年生，牛津大学历史学博士，现为耶路撒冷希伯来大学的历史系教授，青年怪才，全球瞩目的新锐历史学家。他擅长世界历史和宏观历史进程研究。在学术领域和大众读物方面都有卓越贡献。',
    }
  },

  // 获取图书列表
  async getBooks(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟分页和筛选
    const { page = 1, limit = 12, category, search, sort } = params

    // 这里可以根据参数模拟不同的筛选结果
    // 简化处理，返回固定数据
    const total = 100
    const books = Array.from({ length: limit }, (_, i) => ({
      id: (page - 1) * limit + i + 1,
      title: `图书 ${(page - 1) * limit + i + 1}`,
      author: `作者 ${Math.floor(Math.random() * 100)}`,
      coverUrl: `https://picsum.photos/300/400?random=${(page - 1) * limit + i + 20}`,
      price: Math.floor(Math.random() * 50) + 20,
      originalPrice: Math.floor(Math.random() * 30) + 70,
      isNew: Math.random() > 0.7,
      isBestseller: Math.random() > 0.7,
      discount: Math.floor(Math.random() * 3) + 7,
      isFavorite: false,
    }))

    return {
      books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    }
  },
}
