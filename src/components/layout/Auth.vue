<template>
  <div
    class="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-4"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl opacity-20"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-30"
      ></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full relative z-10">
      <!-- 左侧品牌区域 -->
      <div class="flex items-center justify-center py-8 px-4">
        <div class="text-center text-white">
          <div class="flex items-center justify-center mb-6">
            <i class="fa fa-book text-6xl text-white opacity-90 mr-3"></i>
            <span class="text-4xl font-bold text-white">小白书城</span>
          </div>
          <p class="text-2xl text-white opacity-90 font-semibold mb-4">探索知识的海洋</p>
          <p class="text-lg text-white opacity-80 leading-relaxed">
            百万册精选图书，畅享阅读乐趣<br />
            专业图书在线商城，满足您的所有阅读需求
          </p>
        </div>
      </div>

      <!-- 右侧表单区域 - 磨砂透明效果 -->
      <div class="flex items-center justify-center py-8 px-4">
        <div
          class="bg-white bg-opacity-15 backdrop-blur-md border border-white border-opacity-20 p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <!-- 登录表单 -->
          <div v-if="activeTab === 'login'">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-white mb-3">欢迎回来</h2>
              <p class="text-white opacity-80">请输入您的账号密码登录系统</p>
            </div>

            <!-- 错误提示 -->
            <div v-if="loginError" class="bg-red-500 bg-opacity-90 text-white p-4 rounded-lg mb-6">
              {{ loginError }}
            </div>

            <!-- 账号输入 -->
            <div class="mb-5">
              <label class="block text-white font-medium mb-3">账号</label>
              <input
                v-model="loginForm.username"
                @blur="validateLoginField('username')"
                type="text"
                class="w-full p-4 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-15 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-50 focus:bg-white focus:bg-opacity-25 transition-all duration-200"
                placeholder="请输入账号"
              />
              <p v-if="loginErrors.username" class="text-red-300 text-sm mt-2">
                {{ loginErrors.username }}
              </p>
            </div>

            <!-- 密码输入 -->
            <div class="mb-5">
              <label class="block text-white font-medium mb-3">密码</label>
              <div class="relative">
                <input
                  v-model="loginForm.password"
                  @blur="validateLoginField('password')"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full p-4 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-15 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-50 focus:bg-white focus:bg-opacity-25 transition-all duration-200 pr-12"
                  placeholder="请输入密码"
                />
                <button
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  <i :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>
              <p v-if="loginErrors.password" class="text-red-300 text-sm mt-2">
                {{ loginErrors.password }}
              </p>
            </div>

            <!-- 记住我和忘记密码 -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center text-white opacity-80 cursor-pointer">
                <input
                  v-model="loginForm.rememberMe"
                  type="checkbox"
                  class="w-4 h-4 mr-2 rounded border-white border-opacity-50 bg-white bg-opacity-10 focus:ring-2 focus:ring-white focus:ring-opacity-30"
                />
                记住我
              </label>
              <button
                @click="showForgotPassword"
                class="text-white font-semibold opacity-90 hover:opacity-100 transition-opacity"
              >
                忘记密码?
              </button>
            </div>

            <!-- 登录按钮 -->
            <button
              @click="handleLogin"
              :disabled="loading"
              class="w-full py-4 px-6 bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white font-semibold rounded-xl hover:bg-opacity-30 hover:border-opacity-50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>

            <!-- 注册链接 -->
            <div class="text-center">
              <span class="text-white opacity-80">还没有账号? </span>
              <button
                @click="activeTab = 'register'"
                class="text-white font-semibold opacity-90 hover:opacity-100 transition-opacity"
              >
                立即注册
              </button>
            </div>
          </div>

          <!-- 注册表单 -->
          <div v-else>
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-white mb-3">创建账号</h2>
              <p class="text-white opacity-80">填写信息创建您的书城账号</p>
            </div>

            <!-- 错误提示 -->
            <div
              v-if="registerError"
              class="bg-red-500 bg-opacity-90 text-white p-4 rounded-lg mb-6"
            >
              {{ registerError }}
            </div>

            <!-- 账号输入 -->
            <div class="mb-5">
              <label class="block text-white font-medium mb-3">账号</label>
              <input
                v-model="registerForm.username"
                @blur="validateRegisterField('username')"
                type="text"
                class="w-full p-4 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-15 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-50 focus:bg-white focus:bg-opacity-25 transition-all duration-200"
                placeholder="请输入账号"
              />
              <p v-if="registerErrors.username" class="text-red-300 text-sm mt-2">
                {{ registerErrors.username }}
              </p>
            </div>

            <!-- 密码输入 -->
            <div class="mb-5">
              <label class="block text-white font-medium mb-3">密码</label>
              <div class="relative">
                <input
                  v-model="registerForm.password"
                  @blur="validateRegisterField('password')"
                  :type="showRegisterPassword ? 'text' : 'password'"
                  class="w-full p-4 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-15 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-50 focus:bg-white focus:bg-opacity-25 transition-all duration-200 pr-12"
                  placeholder="请输入密码"
                />
                <button
                  @click="showRegisterPassword = !showRegisterPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  <i :class="showRegisterPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>
              <p v-if="registerErrors.password" class="text-red-300 text-sm mt-2">
                {{ registerErrors.password }}
              </p>
            </div>

            <!-- 确认密码 -->
            <div class="mb-5">
              <label class="block text-white font-medium mb-3">确认密码</label>
              <div class="relative">
                <input
                  v-model="registerForm.confirmPassword"
                  @blur="validateRegisterField('confirmPassword')"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="w-full p-4 rounded-xl border-2 border-white border-opacity-30 bg-white bg-opacity-15 text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:border-white focus:border-opacity-50 focus:bg-white focus:bg-opacity-25 transition-all duration-200 pr-12"
                  placeholder="请再次输入密码"
                />
                <button
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  <i :class="showConfirmPassword ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                </button>
              </div>
              <p v-if="registerErrors.confirmPassword" class="text-red-300 text-sm mt-2">
                {{ registerErrors.confirmPassword }}
              </p>
            </div>

            <!-- 同意条款 -->
            <div class="mb-6">
              <label class="flex items-start text-white opacity-80 cursor-pointer">
                <input
                  v-model="registerForm.acceptTerms"
                  type="checkbox"
                  class="w-4 h-4 mr-2 mt-1 rounded border-white border-opacity-50 bg-white bg-opacity-10 focus:ring-2 focus:ring-white focus:ring-opacity-30 flex-shrink-0"
                />
                <span
                  >我同意 <a class="underline">服务条款</a> 和
                  <a class="underline">隐私政策</a></span
                >
              </label>
              <p v-if="registerErrors.acceptTerms" class="text-red-300 text-sm mt-2">
                {{ registerErrors.acceptTerms }}
              </p>
            </div>
            <div
              v-if="registerError || showRegisterSuccess"
              :class="[
                registerError ? 'bg-red-500' : 'bg-green-500',
                'bg-opacity-90 text-white p-4 rounded-lg mb-6 animate-fade-in',
              ]"
            >
              {{ registerError || '注册成功！即将为您跳转到登录页面...' }}
            </div>

            <!-- 注册按钮 -->
            <button
              @click="handleRegister"
              :disabled="loading"
              class="w-full py-4 px-6 bg-white bg-opacity-20 border-2 border-white border-opacity-30 text-white font-semibold rounded-xl hover:bg-opacity-30 hover:border-opacity-50 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>

            <!-- 登录链接 -->
            <div class="text-center">
              <span class="text-white opacity-80">已有账号? </span>
              <button
                @click="activeTab = 'login'"
                class="text-white font-semibold opacity-90 hover:opacity-100 transition-opacity"
              >
                立即登录
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 忘记密码对话框 -->
    <div
      v-if="forgotPasswordVisible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-2xl p-6 w-full max-w-md">
        <h3 class="text-2xl font-bold text-gray-900 mb-4">重置密码</h3>
        <div class="mb-5">
          <label class="block text-gray-900 font-medium mb-3">账号</label>
          <input
            v-model="forgotUsername"
            type="text"
            class="w-full p-4 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-200"
            placeholder="请输入账号"
          />
        </div>
        <p class="text-gray-600 text-sm mb-6">我们将向该账号绑定的邮箱发送密码重置链接，请查收。</p>
        <div class="flex justify-end gap-3">
          <button
            @click="forgotPasswordVisible = false"
            class="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleForgotPassword"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all duration-200"
          >
            发送重置链接
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { formValidators, validateForm } from '@/utils/validators'

export default {
  name: 'Auth',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const activeTab = ref('login')
    const loading = ref(false)
    const forgotPasswordVisible = ref(false)
    const forgotUsername = ref('')
    const showPassword = ref(false)
    const showRegisterPassword = ref(false)
    const showConfirmPassword = ref(false)

    // 登录表单
    const loginForm = reactive({
      username: '',
      password: '',
      rememberMe: false,
    })

    const loginErrors = reactive({})
    const loginError = ref('')

    // 注册表单
    const registerForm = reactive({
      username: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    })

    const registerErrors = reactive({})
    const registerError = ref('')
    const showRegisterSuccess = ref(false)

    // 验证登录表单
    // 验证单个登录字段
    const validateLoginField = (field) => {
      const validator = formValidators.login[field]
      if (validator) {
        loginErrors[field] = validator(loginForm[field], loginForm)
      }
    }

    // 验证单个注册字段
    const validateRegisterField = (field) => {
      const validator = formValidators.register[field]
      if (validator) {
        registerErrors[field] = validator(registerForm[field], registerForm)
      }
    }

    // 验证登录表单
    const validateLoginForm = () => {
      const { isValid, errors } = validateForm(loginForm, formValidators.login)
      Object.assign(loginErrors, errors)
      return isValid
    }

    // 验证注册表单
    const validateRegisterForm = () => {
      const { isValid, errors } = validateForm(registerForm, formValidators.register)
      Object.assign(registerErrors, errors)
      return isValid
    }

    // 处理登录
    const handleLogin = async () => {
      if (!validateLoginForm()) return
      // 打印前端表单封装的数据
      console.log('前端登录表单提交的数据:', loginForm)

      loading.value = true
      loginError.value = ''

      try {
        await authStore.login({
          username: loginForm.username,
          password: loginForm.password,
        })

        router.push('/')
      } catch (error) {
        loginError.value = error.message || '登录失败，请检查账号和密码'
      } finally {
        loading.value = false
      }
    }

    // 处理注册
    // 处理注册（修改部分）
    const handleRegister = async () => {
      if (!validateRegisterForm()) return
      console.log('前端注册表单提交的数据:', registerForm)

      loading.value = true
      registerError.value = '' // 清空错误提示
      showRegisterSuccess.value = false // 清空成功提示

      try {
        await authStore.register({
          username: registerForm.username,
          password: registerForm.password,
        })

        // 显示成功提示
        showRegisterSuccess.value = true

        // 清空表单
        registerForm.username = ''
        registerForm.password = ''
        registerForm.confirmPassword = ''
        registerForm.acceptTerms = false

        // 2秒后切换到登录页
        setTimeout(() => {
          showRegisterSuccess.value = false
          activeTab.value = 'login'
        }, 2000)
      } catch (error) {
        // 显示失败提示
        registerError.value = error.message || '注册失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    // 忘记密码
    const showForgotPassword = () => {
      forgotPasswordVisible.value = true
    }

    const handleForgotPassword = async () => {
      if (!forgotUsername.value) {
        alert('请输入账号')
        return
      }

      try {
        // 这里调用忘记密码API
        await authStore.forgotPassword(forgotUsername.value)
        forgotPasswordVisible.value = false
        alert('重置链接已发送到您的邮箱')
      } catch (error) {
        alert(error.message || '发送失败，请稍后重试')
      }
    }

    return {
      activeTab,
      loading,
      loginForm,
      loginErrors,
      loginError,
      registerForm,
      registerErrors,
      registerError,
      forgotPasswordVisible,
      forgotUsername,
      showPassword,
      showRegisterPassword,
      showConfirmPassword,
      validateLoginField, // 添加这行
      validateRegisterField, // 添加这行
      handleLogin,
      handleRegister,
      showForgotPassword,
      handleForgotPassword,
      showRegisterSuccess,
    }
  },
}
</script>

<style scoped>
/* 新增动画样式 */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* 磨砂玻璃效果 */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

.bg-opacity-15 {
  background-color: rgba(255, 255, 255, 0.15);
}

.bg-opacity-20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.bg-opacity-25 {
  background-color: rgba(255, 255, 255, 0.25);
}

/* 背景模糊效果 */
.blur-3xl {
  filter: blur(64px);
}
</style>
