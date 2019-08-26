import axios from '@/utils/myaxios.js'

// 获取所有角色
export const getAllRoleList = () => {
  return axios({
    url: 'roles'
  })
}
