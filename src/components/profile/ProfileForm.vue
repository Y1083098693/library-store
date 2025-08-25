<template>
  <section class="bg-white rounded-white rounded-xl shadow-sm p-6 lg:p-8 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-800">个人资料</h2>
      <button
        @click="handleToggleEdit"
        class="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center"
      >
        <i class="fa fa-pencil mr-1"></i>
        {{ isEditing ? '取消编辑' : '编辑资料' }}
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 用户账号（不可修改） -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">账号</label>
          <input
            type="text"
            :value="account"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors bg-gray-50 cursor-not-allowed"
            disabled
          />
          <p class="text-xs text-gray-500 mt-1">账号为唯一标识，不可修改</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">昵称</label>
          <input
            type="text"
            v-model="localUserForm.nickname"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :disabled="!isEditing"
            :class="!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''"
            required
            minlength="2"
            maxlength="20"
            placeholder="请输入昵称"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
          <input
            type="email"
            v-model="localUserForm.email"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :disabled="!isEditing"
            :class="!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''"
            required
            placeholder="请输入邮箱"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
          <input
            type="tel"
            v-model="localUserForm.phone"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            :disabled="!isEditing"
            :class="!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''"
            maxlength="11"
            placeholder="请输入您的手机号码"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
          <textarea
            v-model="localUserForm.bio"
            rows="3"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            :disabled="!isEditing"
            :class="!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''"
            maxlength="200"
            placeholder="简单介绍一下自己吧"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">{{ localUserForm.bio.length }}/200</p>
        </div>
      </div>

      <div v-if="isEditing" class="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="submit"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg transition-colors mr-3 flex items-center"
          :disabled="isSubmitting"
        >
          <i class="fa fa-save mr-2"></i>
          <span v-if="!isSubmitting">保存修改</span>
          <span v-if="isSubmitting">保存中...</span>
        </button>
        <button
          type="button"
          @click="handleCancel"
          class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg transition-colors flex items-center"
        >
          <i class="fa fa-times mr-2"></i>
          取消
        </button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: 'ProfileForm',
  props: {
    userForm: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    account: {
      type: String,
      required: true,
      default: '',
    },
    isEditing: {
      type: Boolean,
      required: true,
      default: false,
    },
    isSubmitting: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  emits: ['toggle-edit', 'update-profile'],

  data() {
    return {
      localUserForm: {
        nickname: '',
        email: '',
        phone: '',
        bio: '',
      },
      originalUserForm: {
        nickname: '',
        email: '',
        phone: '',
        bio: '',
      },
    }
  },

  watch: {
    // 监听prop变化，更新本地数据
    userForm: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.localUserForm = {
          nickname: newVal.nickname || '',
          email: newVal.email || '',
          phone: newVal.phone || '',
          bio: newVal.bio || '',
        }
        // 保存原始数据用于取消编辑时恢复
        this.originalUserForm = { ...this.localUserForm }
      },
    },
  },

  methods: {
    handleToggleEdit() {
      if (this.isEditing) {
        // 取消编辑时恢复原始数据
        this.localUserForm = { ...this.originalUserForm }
      }
      this.$emit('toggle-edit')
    },

    handleSubmit() {
      // 将本地表单数据传递给父组件
      this.$emit('update-profile', this.localUserForm)
    },

    handleCancel() {
      // 取消编辑时恢复原始数据
      this.localUserForm = { ...this.originalUserForm }
      this.$emit('toggle-edit')
    },
  },
}
</script>
