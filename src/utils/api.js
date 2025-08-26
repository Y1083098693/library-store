import api from '../services/api'

//api.js
api.defaults.timeout = 10000 // 设置请求超时时间
api.defaults.headers.common['Content-Type'] = 'application/json' // 设置默认请求头
