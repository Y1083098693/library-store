<template>
  <section class="bg-white rounded-xl shadow-sm p-6 lg:p-8 border border-gray-100">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">账户安全</h2>

    <div class="space-y-6">
      <div class="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 class="font-medium text-gray-800">登录密码</h3>
          <p class="text-gray-500 text-sm mt-1">保护您的账户安全，建议定期修改密码</p>
        </div>
        <button
          @click="$emit('toggle-password-form')"
          class="text-primary hover:text-primary/80 text-sm transition-colors"
        >
          {{ showChangePassword ? '收起' : '修改' }}
        </button>
      </div>

      <div class="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 class="font-medium text-gray-800">绑定手机</h3>
          <p class="text-gray-500 text-sm mt-1">
            {{ userForm.phone ? '已绑定: ' + userForm.phone : '未绑定手机' }}
          </p>
        </div>
        <button class="text-primary hover:text-primary/80 text-sm transition-colors">
          {{ userForm.phone ? '更换' : '绑定' }}
        </button>
      </div>

      <div class="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
        <div>
          <h3 class="font-medium text-gray-800">绑定邮箱</h3>
          <p class="text-gray-500 text-sm mt-1">
            {{ userForm.email ? '已绑定: ' + userForm.email : '未绑定邮箱' }}
          </p>
        </div>
        <button class="text-primary hover:text-primary/80 text-sm transition-colors">
          {{ userForm.email ? '更换' : '绑定' }}
        </button>
      </div>
    </div>

    <!-- 密码修改表单 -->
    <div v-if="showChangePassword" class="mt-6 pt-6 border-t border-gray-100">
      <h3 class="text-lg font-medium text-gray-800 mb-4">修改密码</h3>
      <form @submit.prevent="$emit('change-password')" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">原密码</label>
          <input
            type="password"
            v-model="passwordForm.oldPassword"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="请输入原密码"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
          <input
            type="password"
            v-model="passwordForm.newPassword"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="请输入新密码（至少8位）"
            minlength="8"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
          <input
            type="password"
            v-model="passwordForm.confirmPassword"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            placeholder="请再次输入新密码"
            minlength="8"
            required
          />
          <p
            v-if="
              passwordForm.newPassword &&
              passwordForm.confirmPassword &&
              passwordForm.newPassword !== passwordForm.confirmPassword
            "
            class="text-red-500 text-xs mt-1"
          >
            两次输入的密码不一致
          </p>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            @click="$emit('cancel-password-change')"
            class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            :disabled="passwordForm.newPassword !== passwordForm.confirmPassword"
          >
            确认修改
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SecuritySection',
  props: {
    userForm: {
      type: Object,
      required: true,
    },
    showChangePassword: {
      type: Boolean,
      required: true,
    },
    passwordForm: {
      type: Object,
      required: true,
    },
  },
}
</script>
