<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-column">
          <h3>关于我们</h3>
          <ul>
            <li><a href="#">公司简介</a></li>
            <li><a href="#">联系我们</a></li>
            <li><a href="#">加入我们</a></li>
            <li><a href="#">隐私政策</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>客户服务</h3>
          <ul>
            <li><a href="#">帮助中心</a></li>
            <li><a href="#">配送方式</a></li>
            <li><a href="#">支付方式</a></li>
            <li><a href="#">退换货政策</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>关注我们</h3>
          <div class="social-icons">
            <a href="#" class="icon"><i class="el-icon-weixin"></i> 微信</a>
            <a href="#" class="icon"><i class="el-icon-weibo"></i> 微博</a>
            <a href="#" class="icon"><i class="el-icon-qq"></i> QQ</a>
          </div>
          <p class="contact-phone">客服电话：400-123-4567</p>
        </div>
        <div class="footer-column">
          <h3>订阅新书通知</h3>
          <div class="subscribe-form">
            <input type="email" placeholder="请输入您的邮箱" v-model="email" />
            <button @click="subscribe">订阅</button>
          </div>
          <p class="subscribe-desc">第一时间获取新书上架和优惠活动信息</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2023 知阅图书馆 版权所有 | 京ICP备12345678号</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const email = ref('')

const subscribe = () => {
  if (!email.value) {
    ElMessage.warning('请输入您的邮箱地址')
    return
  }

  // 简单的邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }

  // 模拟订阅成功
  ElMessage.success('订阅成功！我们会及时向您推送新书信息')
  email.value = ''
}
</script>

<style scoped>
.footer {
  background-color: #f5f5f5;
  padding: 40px 0 20px;
  margin-top: 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
}

.footer-column {
  flex: 1;
  min-width: 200px;
  max-width: 25%; /* 确保四列平均分配宽度 */
}

.footer-column h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-bottom: 10px;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background-color: #e53e3e; /* 改为与网站红色主题一致 */
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column ul li {
  margin-bottom: 10px;
}

.footer-column a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #e53e3e; /* 改为与网站红色主题一致 */
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-icons .icon {
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-phone {
  margin-top: 20px;
  color: #666;
  font-size: 16px;
}

.subscribe-form {
  display: flex;
  margin-bottom: 10px;
  width: 100%;
}

.subscribe-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 4px 0 0 4px;
  outline: none;
  box-sizing: border-box;
}

.subscribe-form button {
  background-color: #e53e3e; /* 改为与网站红色主题一致 */
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.subscribe-form button:hover {
  background-color: #c53030; /* 深红色 hover 效果 */
}

.subscribe-desc {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
  color: #999;
  font-size: 14px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .footer-column {
    max-width: 50%;
  }
}

@media (max-width: 480px) {
  .footer-column {
    max-width: 100%;
  }
}
</style>
