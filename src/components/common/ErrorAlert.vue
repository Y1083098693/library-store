<template>
  <div class="error-alert bg-red-50 border border-red-200 rounded-md p-4 mb-4" v-if="message">
    <div class="flex items-start">
      <i class="fa fa-exclamation-circle text-red-500 mt-0.5 mr-3"></i>
      <p class="text-red-700">{{ message }}</p>
      <button class="ml-auto text-red-400 hover:text-red-600" @click="$emit('close')">
        <i class="fa fa-times"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorAlert',
  props: {
    message: {
      type: String,
      default: '',
    },
  },
}
</script>
