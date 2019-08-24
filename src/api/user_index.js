// 引入axios
import axios from '@/utils/myaxios.js'
// 获取所有用户数据
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}
