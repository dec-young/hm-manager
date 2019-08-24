// 这个文件封装与axios相关的所有配置
import axios from 'axios'
// 这是基准路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// axios设置请求拦截器
axios.interceptors.request.use(config => {
  let mytoken = localStorage.getItem('hm_manager_token')
  if (mytoken) {
    config.headers.Authorization = mytoken
  }
  return config
}, error => {
  // 请求错误
//   console.log(error)
  return Promise.reject(error)
})

export default axios
