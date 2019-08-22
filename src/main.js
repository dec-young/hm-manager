import Vue from 'vue'
import App from './App.vue'
import router from './router/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//
import '@/styles/icon.less'
Vue.use(ElementUI)

// 导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  let token = localStorage.getItem('hm_manager_token')
  // console.log(token)
  if (token || to.path === '/login') {
    next()
  } else {
    next({ name: 'login' })
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
