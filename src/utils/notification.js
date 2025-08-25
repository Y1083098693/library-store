// 通知提示工具
export function showToast(message, type = 'success', duration = 3000) {
  // 创建通知元素
  const toast = document.createElement('div')

  // 设置基础样式
  toast.className = `fixed top-20 right-4 px-4 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300 translate-x-full opacity-0`

  // 根据类型设置样式
  switch (type) {
    case 'success':
      toast.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-200')
      toast.innerHTML = `<i class="fa fa-check-circle mr-2"></i>${message}`
      break
    case 'error':
      toast.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-200')
      toast.innerHTML = `<i class="fa fa-exclamation-circle mr-2"></i>${message}`
      break
    case 'warning':
      toast.classList.add('bg-yellow-50', 'text-yellow-800', 'border', 'border-yellow-200')
      toast.innerHTML = `<i class="fa fa-exclamation-triangle mr-2"></i>${message}`
      break
    default:
      toast.classList.add('bg-gray-50', 'text-gray-800', 'border', 'border-gray-200')
      toast.innerHTML = message
  }

  // 添加到页面
  document.body.appendChild(toast)

  // 显示动画
  setTimeout(() => {
    toast.classList.remove('translate-x-full', 'opacity-0')
  }, 10)

  // 自动关闭
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0')
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, duration)
}
