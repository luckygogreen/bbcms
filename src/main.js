import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

// 配置API 接口通过 绑定 axios
import axios from 'axios' // 导入axios包
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 设置 axios 访问的根路径也就是API接口路径
Vue.prototype.$http = axios // 把axios包挂载到VUE的原型对象上

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
