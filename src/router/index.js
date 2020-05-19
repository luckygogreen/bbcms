import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import welcome from '../components/welcome'
import users from '../components/user/user'
import roles from '../components/role/role'
import right from '../components/power/right'
import categories from '../components/goodCategory/categories'
import attributes from '../components/goodCategory/params'
import goods from '../components/goodCategory/goods'
import addgood from '../components/goodCategory/addGood'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: login
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/users',
    children: [
      {
        path: '/welcome',
        component: welcome
      },
      {
        path: '/users',
        component: users
      },
      {
        path: '/roles',
        component: roles
      }, {
        path: '/rights',
        component: right
      }, {
        path: '/categories',
        component: categories
      }, {
        path: '/params',
        component: attributes
      }, {
        path: '/goods',
        component: goods
      }, {
        path: '/goods/add',
        component: addgood
      }]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()  放行    next('/login')  强制跳转
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
