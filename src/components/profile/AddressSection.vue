<template>
  <section class="bg-white rounded-xl shadow-sm p-6 lg:p-8 border border-gray-100">
    <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
      <h3 class="text-xl font-semibold text-gray-800">收货地址管理</h3>
      <button
        class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
        @click="showAddForm = true"
      >
        <i class="fa fa-plus mr-1"></i> 添加新地址
      </button>
    </div>

    <!-- 地址列表 -->
    <div class="address-list space-y-4" v-if="addresses.length > 0">
      <div
        class="address-item border border-gray-200 rounded-xl p-4 hover:border-primary/50 transition-all duration-300 relative"
        v-for="address in addresses"
        :key="address.id"
      >
        <div class="absolute top-3 right-3 flex space-x-2">
          <button
            class="text-gray-500 hover:text-primary p-1 transition-colors"
            @click="editAddress(address)"
            aria-label="编辑地址"
          >
            <i class="fa fa-edit"></i>
          </button>
          <button
            class="text-gray-500 hover:text-red-500 p-1 transition-colors"
            @click="confirmDelete(address.id)"
            aria-label="删除地址"
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>

        <div class="address-info">
          <p class="font-medium mb-2">{{ address.recipient_name }} {{ address.recipient_phone }}</p>
          <p class="text-gray-600">
            {{ address.province }} {{ address.city }} {{ address.district }}
            {{ address.detail_address }}
          </p>
        </div>

        <div class="address-actions mt-3 flex items-center">
          <button
            class="text-sm text-primary hover:text-primary/80 transition-colors"
            @click="setDefault(address.id)"
            v-if="!address.is_default"
          >
            设为默认
          </button>
          <span class="text-sm text-gray-500" v-if="address.is_default">
            <i class="fa fa-check-circle text-primary mr-1"></i>默认地址
          </span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-address text-center py-16" v-if="addresses.length === 0 && !isLoading">
      <i class="fa fa-map-marker text-5xl text-gray-300 mb-4"></i>
      <p class="text-gray-500 mb-4">暂无收货地址</p>
      <button
        class="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center mx-auto"
        @click="showAddForm = true"
      >
        <i class="fa fa-plus mr-1"></i> 添加第一个地址
      </button>
    </div>

    <!-- 加载状态 -->
    <div class="loading py-12 text-center" v-if="isLoading">
      <LoadingState message="加载地址中..." />
    </div>

    <!-- 添加/编辑地址表单 -->
    <div
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      v-if="showAddForm || showEditForm"
    >
      <div
        class="modal-container bg-white rounded-xl w-full max-w-md p-6 shadow-lg transform transition-all"
      >
        <h4 class="text-lg font-semibold mb-4 text-gray-800">
          {{ showAddForm ? '添加新地址' : '编辑地址' }}
        </h4>

        <form @submit.prevent="handleSubmit">
          <div class="form-group mb-3">
            <label class="block text-gray-700 mb-1 text-sm">收件人</label>
            <input
              type="text"
              v-model="addressForm.recipient_name"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div class="form-group mb-3">
            <label class="block text-gray-700 mb-1 text-sm">联系电话</label>
            <input
              type="tel"
              v-model="addressForm.recipient_phone"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div class="form-group mb-3">
            <label class="block text-gray-700 mb-1 text-sm">省份</label>
            <input
              type="text"
              v-model="addressForm.province"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div class="form-group mb-3">
            <label class="block text-gray-700 mb-1 text-sm">城市</label>
            <input
              type="text"
              v-model="addressForm.city"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div class="form-group mb-3">
            <label class="block text-gray-700 mb-1 text-sm">区/县</label>
            <input
              type="text"
              v-model="addressForm.district"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              required
            />
          </div>

          <div class="form-group mb-4">
            <label class="block text-gray-700 mb-1 text-sm">详细地址</label>
            <textarea
              v-model="addressForm.detail_address"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-check mb-4 flex items-center">
            <input type="checkbox" id="isDefault" v-model="addressForm.is_default" class="mr-2" />
            <label for="isDefault" class="text-gray-700">设为默认地址</label>
          </div>

          <div class="flex space-x-3">
            <button
              type="button"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition-colors"
              @click="cancelForm"
            >
              取消
            </button>
            <button
              type="submit"
              class="flex-1 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-lg transition-colors"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? '保存中...' : '保存地址' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <div
      class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      v-if="showDeleteConfirm"
    >
      <div class="modal-container bg-white rounded-xl w-full max-w-sm p-6 shadow-lg">
        <h4 class="text-lg font-semibold mb-3 text-gray-800">确认删除</h4>
        <p class="text-gray-600 mb-4">确定要删除这个地址吗？删除后不可恢复。</p>

        <div class="flex space-x-3">
          <button
            type="button"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg transition-colors"
            @click="showDeleteConfirm = false"
          >
            取消
          </button>
          <button
            type="button"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition-colors"
            @click="handleDelete"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import LoadingState from '@/components/common/LoadingState.vue'

export default {
  name: 'AddressSection',
  components: {
    LoadingState,
  },
  props: {
    addresses: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showAddForm: false,
      showEditForm: false,
      showDeleteConfirm: false,
      currentAddressId: null,
      addressForm: {
        recipient_name: '',
        recipient_phone: '',
        province: '',
        city: '',
        district: '',
        detail_address: '',
        is_default: false,
      },
    }
  },
  methods: {
    editAddress(address) {
      this.currentAddressId = address.id
      this.addressForm = { ...address }
      this.showEditForm = true
    },
    confirmDelete(addressId) {
      this.currentAddressId = addressId
      this.showDeleteConfirm = true
    },
    handleDelete() {
      this.$emit('delete-address', this.currentAddressId)
      this.showDeleteConfirm = false
      this.currentAddressId = null
    },
    setDefault(addressId) {
      this.$emit('set-default', addressId)
    },
    handleSubmit() {
      if (this.showAddForm) {
        this.$emit('add-address', this.addressForm)
      } else {
        this.$emit('update-address', {
          id: this.currentAddressId,
          ...this.addressForm,
        })
      }
      this.cancelForm()
    },
    cancelForm() {
      this.showAddForm = false
      this.showEditForm = false
      this.currentAddressId = null
      this.addressForm = {
        recipient_name: '',
        recipient_phone: '',
        province: '',
        city: '',
        district: '',
        detail_address: '',
        is_default: false,
      }
    },
  },
}
</script>

<style scoped>
/* 移除之前的样式，保持与其他组件一致的外部样式控制 */
</style>
