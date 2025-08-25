<template>
  <div
    class="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out"
    :class="{
      'translate-x-full opacity-0': !visible,
      'translate-x-0 opacity-100': visible,
    }"
  >
    <div
      class="flex items-center p-4 rounded-lg shadow-lg border-l-4"
      :class="{
        'bg-green-50 border-green-500 text-green-800': type === 'success',
        'bg-red-50 border-red-500 text-red-800': type === 'error',
        'bg-blue-50 border-blue-500 text-blue-800': type === 'info',
        'bg-yellow-50 border-yellow-500 text-yellow-800': type === 'warning',
      }"
    >
      <i
        class="mr-3 text-xl"
        :class="{
          'fa fa-check-circle': type === 'success',
          'fa fa-times-circle': type === 'error',
          'fa fa-info-circle': type === 'info',
          'fa fa-exclamation-triangle': type === 'warning',
        }"
      ></i>
      <div class="flex-1">
        <h3 class="font-medium" v-if="title">{{ title }}</h3>
        <p class="text-sm mt-1" v-if="message">{{ message }}</p>
      </div>
      <button class="ml-4 text-gray-400 hover:text-gray-600" @click="close">
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => {
        return ['success', 'error', 'info', 'warning'].includes(value)
      },
    },
    title: String,
    message: String,
    duration: {
      type: Number,
      default: 3000,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
  watch: {
    visible(newVal) {
      if (newVal && this.duration > 0) {
        setTimeout(() => {
          this.close()
        }, this.duration)
      }
    },
  },
}
</script>
