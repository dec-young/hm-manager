// 引入axios
import axios from '@/utils/myaxios.js'

// 登录
export const login = (data) => {
// axios返回一个promise对象
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
