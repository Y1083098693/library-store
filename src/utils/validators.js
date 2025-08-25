// 邮箱验证
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 用户名验证
export const validateUsername = (username) => {
  if (!username) return '账号不能为空'
  if (username.length < 3) return '账号长度不能少于3位'
  if (username.length > 20) return '账号长度不能超过20位'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return '账号只能包含字母、数字和下划线'
  return null
}

// 密码验证
export const validatePassword = (password) => {
  if (!password) return '密码不能为空'
  if (password.length < 6) return '密码长度不能少于6位'
  if (password.length > 30) return '密码长度不能超过30位'
  return null
}

// 确认密码验证
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return '请确认密码'
  if (password !== confirmPassword) return '两次输入的密码不一致'
  return null
}

// 表单验证器
export const formValidators = {
  login: {
    username: validateUsername,
    password: validatePassword,
  },
  register: {
    username: validateUsername,
    email: (email) => {
      if (email && !validateEmail(email)) return '请输入有效的邮箱地址'
      return null
    },
    password: validatePassword,
    confirmPassword: (confirmPassword, { password }) =>
      validateConfirmPassword(password, confirmPassword),
    acceptTerms: (acceptTerms) => {
      if (!acceptTerms) return '请同意服务条款和隐私政策'
      return null
    },
  },
}

// 验证整个表单
export const validateForm = (formData, validatorConfig) => {
  const errors = {}
  let isValid = true

  Object.keys(validatorConfig).forEach((field) => {
    const validator = validatorConfig[field]
    const error = typeof validator === 'function' ? validator(formData[field], formData) : null

    if (error) {
      errors[field] = error
      isValid = false
    }
  })

  return { isValid, errors }
}
