import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import tableTree from 'vue-table-with-tree-grid'

// 配置API 接口通过 绑定 axios
import axios from 'axios' // 导入axios包
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 设置 axios 访问的根路径也就是API接口路径
// 为 axios 添加拦截器 在每个API访问头添加 token
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})

// 全局化创建时间过滤器函数
// dateFormat 为调用的方法起一个名字
// originVal 为调用dateFormat(originVal)传过来的参数
Vue.filter('dateFormat', function (originVal) {
  // 实例化这个时间对象
  const dt = new Date(originVal)
  // 拆分年月日分秒时
  const y = dt.getFullYear()
  // 获取月份 因为month 是从0开始的所以让他加1,加1后就是真的月份,
  // ''加空可以让数字类型强转为字符串,
  // padStart是填重参数,第一个参数代表一共多少位,第二个参数代表不足的位数的在前面以0填充
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.prototype.$http = axios // 把axios包挂载到VUE的原型对象上
Vue.component('table-tree', tableTree)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
