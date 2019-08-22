// 1.引入vue
import Vue from 'vue'
// 2.引入路由
import VueRouter from 'vue-router'
// 引入需要使用到的组件
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
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
      component: Home
    }
  ]
})
