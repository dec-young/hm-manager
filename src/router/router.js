// 1.引入vue
import Vue from 'vue'
// 2.引入路由
import VueRouter from 'vue-router'

import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Welcome from '@/views/welcome.vue'

// 用户管理
import Users from '@/views/user/users.vue'
// 权限管理
import RoleList from '@/views/limit/roleList.vue'
import LimitList from '@/views/limit/limitList.vue'

// 商品管理
import ProductList from '@/views/product/productList.vue'
import CataList from '@/views/product/cataList.vue'
import ProductCate from '@/views/product/productCate.vue'

// 3.使用VueRouter 来管理路由
Vue.use(VueRouter)
// 4.创建路由对象,实现路由和组件的映射
export default new VueRouter({
  // 5.添加路由配置
  routes: [
    {
      name: 'default',
      path: '/',
      redirect: { name: 'login' }
    },
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: Welcome
        },
        {
          name: 'users',
          path: 'users',
          component: Users
        },
        // 权限管理
        {
          name: 'limitList',
          path: 'limitList',
          component: LimitList
        },
        {
          name: 'roleList',
          path: 'roleList',
          component: RoleList
        },
        // 商品管理
        {
          name: 'productList',
          path: 'productList',
          component: ProductList
        },
        {
          name: 'cataList',
          path: 'cataList',
          component: CataList
        },
        {
          name: 'productCate',
          path: 'productCate',
          component: ProductCate
        }
      ]
    }
  ]
})
