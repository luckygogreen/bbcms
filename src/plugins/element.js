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
  Submenu,
  Breadcrumb,
  BreadcrumbItem,
  Row,
  Col,
  Card,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree
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
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.prototype.$notify = Notification // 把 Notification 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
Vue.prototype.$message = Message // 把 Message 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
Vue.prototype.$confirm = MessageBox.confirm // 把 Messagebox 挂载到 vue的原型对象上 挂载后的原型对象编可以通过 this.$ 来操作
