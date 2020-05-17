<template>
  <div class="login_container">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <div>
        <el-form ref="loginFormRef" :model="loginFrom" :rules="loginFromRules" class="login_form">
          <el-form-item prop="username">
            <el-input v-model="loginFrom.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginFrom.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginFrom">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 绑定表单数据
      loginFrom: {
        username: 'admin',
        password: '123456'
      },
      // 添加表单用户名和密码的验证属性
      loginFromRules: {
        username: [
          {
            required: true,
            message: '请输入登录名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginFrom () {
      // 重置表单数据
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 方法一传统JS语句
      // this.$refs.loginFormRef.validate(function (callback) {
      //   console.log(callback)
      // })
      // 箭头函数的ES6方式 callback =>  就相当于 function (callback)
      this.$refs.loginFormRef.validate(async callback => {
        // 普通写法
        // const res = await this.$http.post('login', this.loginFrom)
        // console.log(res.data)
        if (!callback) return // 判断用户是否输入正确的数据,如果没有输入正确的数据,不做下面的操作
        // 高级写法
        const { data: res } = await this.$http.post('login', this.loginFrom) // 把返回结果里面的data 赋值给 res
        // console.log(res)
        // 高级写法
        // if (res.meta.status === 200) return this.$notify.success({title: '登录成功',message: '祝您使用愉快',type: 'success'})
        // 常规写法
        if (res.meta.status === 200) {
          // 登录成功后保存token
          window.sessionStorage.setItem('token', res.data.token)
          this.$notify({
            title: '登录成功',
            message: '祝您使用愉快',
            type: 'success'
          })
          // 登录成功后跳转到指定页面
          // setTimeout(this.$router.push('/home'), 1000)
          this.$router.push('/home')
        } else {
          this.$notify.error({
            title: '登录失败',
            message: '用户名或密码错误'
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px; /* 设置边框为圆角边框,弧度为10°*/
  position: absolute; /* 设置为绝对位置*/
  left: 50%; /* 设置据左边50%*/
  top: 50%; /* 设置据顶部50%*/
  transform: translate(-50%, -50%); /* 设置X横轴平移450px的 50% Y纵轴 平移高度300的 50% */

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px; /* 设置头像边框内边距 */
    box-shadow: 0 0 10px #ddd; /* 设置头像边框阴影*/
    position: absolute;
    left: 50%; /* 设置头像框距离login-box 的位置为左偏 50% */
    transform: translate(-50%, -50%); /* 设置头像框的水平垂直位置,负数代表操作边框 */
    background-color: #f3fff6;

    img {
      width: 100%; /* 这里是设置让图片宽高 都是 avatoar_box 的宽高 现在就是130 减去 pading的10所以就是120 图片高度120 */
      height: 100%;
      border-radius: 50%; /* 设置图片的边框弧度 ,如果设置为50% 这表示把图片取圆*/
      background-color: #e8eeeb; /* 设置图片透明部分的背景颜色 */
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px; /* 上下间距为0, 左右间距为20px */
  box-sizing: border-box;
}

.btns {
  display: flex; /* 规定布局方式为 弹性布局 弹性布局的方式有6种*/
  justify-content: flex-end; /* 元素在主轴（页面）上由右或者下开始排列 */
}
</style>
