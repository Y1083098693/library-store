<template>
  <div class="avatar-uploader">
    <!-- 上传按钮 -->
    <label class="upload-btn" for="avatar-upload">
      <input
        type="file"
        id="avatar-upload"
        accept="image/jpeg, image/png, image/gif"
        @change="handleFileChange"
        class="hidden"
      />
      <div class="preview-container">
        <img :src="previewUrl || defaultAvatar" alt="预览头像" class="preview-img" />
        <div class="upload-overlay">
          <i class="fa fa-camera"></i>
          <span class="upload-text">更换头像</span>
        </div>
      </div>
    </label>

    <!-- 上传进度 -->
    <div v-if="uploading" class="upload-progress">
      <div class="progress-bar" :style="{ width: progress + '%' }"></div>
    </div>

    <!-- 错误提示 -->
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: 'AvatarUploader',
  props: {
    // 当前头像URL
    currentAvatar: {
      type: String,
      default: '',
    },
    // 默认头像
    defaultAvatar: {
      type: String,
      default: 'https://picsum.photos/id/64/200',
    },
    // 上传成功后的回调
    onSuccess: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      previewUrl: this.currentAvatar,
      uploading: false,
      progress: 0,
      error: null,
    }
  },
  methods: {
    // 处理文件选择
    handleFileChange(e) {
      const file = e.target.files[0]
      if (!file) return

      // 验证文件类型和大小
      if (!this.validateFile(file)) return

      // 显示预览
      this.previewFile(file)

      // 上传文件
      this.uploadFile(file)

      // 重置input值，允许重复选择同一文件
      e.target.value = ''
    },

    // 验证文件
    validateFile(file) {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        this.error = '请上传JPG、PNG或GIF格式的图片'
        return false
      }

      // 验证文件大小（不超过5MB）
      if (file.size > 5 * 1024 * 1024) {
        this.error = '图片大小不能超过5MB'
        return false
      }

      this.error = null
      return true
    },

    // 预览文件
    previewFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewUrl = e.target.result
      }
      reader.readAsDataURL(file)
    },

    // 上传文件
    async uploadFile(file) {
      try {
        this.uploading = true
        this.progress = 0

        const formData = new FormData()
        formData.append('avatar', file)

        // 调用API上传头像
        const response = await api.post('/users/avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          },
        })

        // 上传成功，通知父组件
        this.onSuccess(response.data.avatarUrl)
      } catch (err) {
        this.error = err.response?.data?.message || '上传失败，请重试'
        // 恢复原头像
        this.previewUrl = this.currentAvatar
      } finally {
        this.uploading = false
      }
    },
  },
}
</script>

<style scoped>
.upload-btn {
  cursor: pointer;
  display: inline-block;
}

.preview-container {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #eee;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.upload-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preview-container:hover .upload-overlay {
  opacity: 1;
}

.upload-overlay i {
  font-size: 24px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
}

.upload-progress {
  height: 4px;
  width: 120px;
  background-color: #eee;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.error-message {
  color: #ef4444;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
}
</style>
