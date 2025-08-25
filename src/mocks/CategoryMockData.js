// 扩展的图书分类信息
const CATEGORY_INFO = {
  literature: {
    name: '文学小说',
    description: '探索经典与现代文学作品，感受文字之美',
  },
  'social-science': {
    name: '社科经管',
    description: '了解社会、经济与管理领域的真知灼见',
  },
  technology: {
    name: '科技科普',
    description: '探索科技前沿与科学知识的奥秘',
  },
  lifestyle: {
    name: '生活艺术',
    description: '发现生活美学与实用技巧',
  },
  education: {
    name: '教育学习',
    description: '提升自我的各类学习资源',
  },
  children: {
    name: '少儿读物',
    description: '适合儿童阅读的优质图书',
  },
}

// 生成模拟图书数据的函数
function generateMockBooks(category, count = 36) {
  const mockBooks = []

  // 根据分类生成不同的图书主题
  let titles = []
  let authors = []
  // 修正变量名：publisherss → publishers
  const publishers = ['人民文学出版社', '商务印书馆', '中华书局', '三联书店', '中信出版社']
  const types = ['平装', '精装', '电子书', '有声书']

  // 按分类初始化标题和作者
  switch (category) {
    case 'literature':
      titles = [
        '沉默的大多数',
        '活着',
        '百年孤独',
        '围城',
        '三体',
        '解忧杂货店',
        '追风筝的人',
        '红楼梦',
        '水浒传',
        '西游记',
        '三国演义',
        '呐喊',
        '彷徨',
        '边城',
        '呼兰河传',
      ]
      authors = [
        '王小波',
        '余华',
        '加西亚·马尔克斯',
        '钱钟书',
        '刘慈欣',
        '东野圭吾',
        '卡勒德·胡赛尼',
        '曹雪芹',
        '施耐庵',
        '吴承恩',
        '罗贯中',
        '鲁迅',
        '鲁迅',
        '沈从文',
        '萧红',
      ]
      break

    case 'social-science':
      titles = [
        '人类简史',
        '未来简史',
        '今日简史',
        '思考，快与慢',
        '原则',
        '国富论',
        '资本论',
        '社会契约论',
        '理想国',
        '枪炮、病菌与钢铁',
        '乌合之众',
        '自卑与超越',
        '梦的解析',
        '万历十五年',
        '乡土中国',
      ]
      authors = [
        '尤瓦尔·赫拉利',
        '尤瓦尔·赫拉利',
        '尤瓦尔·赫拉利',
        '丹尼尔·卡尼曼',
        '瑞·达利欧',
        '亚当·斯密',
        '卡尔·马克思',
        '让-雅克·卢梭',
        '柏拉图',
        '贾雷德·戴蒙德',
        '古斯塔夫·勒庞',
        '阿尔弗雷德·阿德勒',
        '西格蒙德·弗洛伊德',
        '黄仁宇',
        '费孝通',
      ]
      break

    case 'technology':
      titles = [
        '时间简史',
        '果壳中的宇宙',
        '宇宙的未来',
        '深度学习',
        '人工智能：现代方法',
        '计算机程序的构造和解释',
        '浪潮之巅',
        '数学之美',
        '数据结构与算法分析',
        'Python编程：从入门到实践',
        'Java编程思想',
        'JavaScript高级程序设计',
        '操作系统概念',
        '计算机网络',
        '量子力学导论',
      ]
      authors = [
        // 修正变量名：authorss → authors
        '史蒂芬·霍金',
        '史蒂芬·霍金',
        '史蒂芬·霍金',
        '伊恩·古德费洛',
        '斯图尔特·罗素',
        '哈罗德·阿贝尔森',
        '吴军',
        '吴军',
        '马克·艾伦·维斯',
        '埃里克·马瑟斯',
        '布鲁斯·埃克尔',
        '尼古拉斯·泽卡斯',
        '安德鲁·塔嫩鲍姆',
        '詹姆斯·K·罗斯科',
        '理查德·费曼',
      ]
      break

    default:
      titles = [
        '沉默的大多数',
        '活着',
        '百年孤独',
        '围城',
        '三体',
        '解忧杂货店',
        '追风筝的人',
        '红楼梦',
        '水浒传',
      ]
      authors = [
        // 修正变量名：authorss → authors
        '王小波',
        '余华',
        '加西亚·马尔克斯',
        '钱钟书',
        '刘慈欣',
        '东野圭吾',
        '卡勒德·胡赛尼',
        '曹雪芹',
        '施耐庵',
      ]
  }

  // 生成指定数量的图书数据
  for (let i = 1; i <= count; i++) {
    // 随机生成图书属性
    const basePrice = Math.floor(Math.random() * 130) + 20 // 20-150元
    const discount = Math.random() > 0.3 ? Math.floor(Math.random() * 30) + 70 : 100 // 70-100%折扣
    const originalPrice = Math.round(basePrice / (discount / 100))
    const rating = (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0评分
    const reviewCount = Math.floor(Math.random() * 2000) + 10 // 10-2010条评论
    const isNew = Math.random() > 0.7 // 30%是新书
    const isBestseller = Math.random() > 0.8 // 20%是畅销书
    const bookType = types[Math.floor(Math.random() * types.length)]
    // 修正变量名：publisher → publishers
    const publisher = publishers[Math.floor(Math.random() * publishers.length)]

    // 循环使用标题和作者数组
    const titleIndex = i % titles.length
    const authorIndex = i % authors.length

    // 为重复的标题添加不同版本信息
    let title = titles[titleIndex]
    if (i >= titles.length) {
      const edition = Math.floor(i / titles.length) + 1
      title += `（第${edition}版）`
    }

    // 生成与图书内容相关的图片
    let imageSeed = `${category}-${titleIndex}-${i}`
    // 对不同分类使用不同的图片类别
    let imageCategory = ''
    switch (category) {
      case 'literature':
        imageCategory = 'books'
        break
      case 'social-science':
        imageCategory = 'business'
        break
      case 'technology':
        imageCategory = 'technology'
        break
      case 'lifestyle':
        imageCategory = 'nature'
        break
      case 'education':
        imageCategory = 'education'
        break
      case 'children':
        imageCategory = 'animals'
        break
      default:
        imageCategory = 'books'
    }

    mockBooks.push({
      id: `book-${category}-${i}`,
      title,
      author: authors[authorIndex],
      // 使用更适合图书封面的图片尺寸和分类
      coverImage: `https://picsum.photos/seed/${imageSeed}/400/600?grayscale=false`,
      // 添加封面缩略图用于列表视图
      thumbnailImage: `https://picsum.photos/seed/${imageSeed}/200/300?grayscale=false`,
      price: basePrice,
      originalPrice,
      discount,
      rating: parseFloat(rating),
      reviewCount,
      publisher,
      type: bookType,
      isNew,
      isBestseller,
      category,
      publishDate: new Date(
        Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 3,
      ).toISOString(),
    })
  }

  return mockBooks
}

// 示例：生成各分类的模拟数据
const mockData = {
  literature: generateMockBooks('literature'),
  'social-science': generateMockBooks('social-science'),
  technology: generateMockBooks('technology'),
  lifestyle: generateMockBooks('lifestyle'),
  education: generateMockBooks('education'),
  children: generateMockBooks('children'),
}

// 导出数据和生成函数
export { CATEGORY_INFO, generateMockBooks, mockData }
