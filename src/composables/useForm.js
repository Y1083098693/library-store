import { reactive, ref } from 'vue'
import { formValidators, validateForm } from '@/utils/validators'

export function useForm(initialData, validatorType) {
  const formData = reactive({ ...initialData })
  const errors = reactive({})
  const loading = ref(false)
  const serverError = ref('')

  // 重置表单
  const resetForm = () => {
    Object.keys(initialData).forEach((key) => {
      formData[key] = initialData[key]
    })
    clearErrors()
  }

  // 清除错误
  const clearErrors = () => {
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })
    serverError.value = ''
  }

  // 验证表单
  const validate = () => {
    clearErrors()

    const validatorConfig = formValidators[validatorType]
    if (!validatorConfig) return true

    const { isValid, errors: validationErrors } = validateForm(formData, validatorConfig)
    Object.assign(errors, validationErrors)

    return isValid
  }

  // 设置服务器错误
  const setServerError = (message) => {
    serverError.value = message
  }

  // 设置字段错误
  const setFieldError = (field, message) => {
    errors[field] = message
  }

  return {
    formData,
    errors,
    loading,
    serverError,
    resetForm,
    clearErrors,
    validate,
    setServerError,
    setFieldError,
  }
}
