import Vue from 'vue'
import { Button, Form, FormItem, Input, Notification, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$notify = Notification // 把 Notification 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
Vue.prototype.$message = Message // 把 Notification 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
