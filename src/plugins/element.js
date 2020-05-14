import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Notification,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  Menu,
  MenuItem,
  Submenu
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.prototype.$notify = Notification // 把 Notification 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
Vue.prototype.$message = Message // 把 Notification 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
