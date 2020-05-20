<template>
  <el-container class="home-container">
    <!-- 如果 isCollapse 是 ture 边栏宽度为64px 否在边栏宽度为200px -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <div class="avatar_box" v-show="showbox">
        <img src="../assets/logo.png" alt="" class="get-potinter" @click="goHomePage">
      </div>
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
        <!--                一级导航-->
        <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
          <!--                    一级导航模板-->
          <template slot="title">
            <!--                        一级导航图标-->
            <i :class="iconobj[item.id]"></i>
            <!--                        一级导航文本-->
            <span>{{ item.authName }}</span>
          </template>
          <!--                    二级导航-->
          <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState('/'+subitem.path)">
            <!--                        二级导航模板-->
            <template slot="title">
              <!--                            二级导航图标-->
              <i class="el-icon-menu"></i>
              <!--                            二级导航文本-->
              <span>{{subitem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          <!--          <img class="logo-class get-potinter" src="../assets/logo.png" alt="" @click="goHomePage">-->
          <span class="get-potinter" @click="goHomePage">Vue + Element Ui 后台管理</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      showbox: true,
      iconobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  // 定义一个声明周期函数 creates里面就是要调用的声明周期函数
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // test
    goHomePage () {
      this.$router.push('/users')
    },
    // 登出操作
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message({
        message: '您已成功退出,如需访问请重新登录',
        type: 'success'
      })
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.error)
      this.menulist = res.data
      // console.log(res)
    },
    // 控制边栏伸展
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse === true) {
        this.showbox = false
      } else {
        this.showbox = true
      }
    },
    // 给导航栏地址动态赋值
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.logo-class {
  margin-left: 15px;
  width: 10%;
  height: 10%;
}

.home-container {
  height: 100%;
}

.el-footer {
  background-color: #373d41;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.get-potinter {
  cursor: pointer;
}

.avatar_box {
  margin: 25px;
  height: 100px;
  width: 100px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px; /* 设置头像边框内边距 */
  box-shadow: 0 0 10px #ddd; /* 设置头像边框阴影*/
  /*position: absolute;*/
  /*left: 50%; !* 设置头像框距离login-box 的位置为左偏 50% *!*/
  /*transform: translate(-50%, -50%); !* 设置头像框的水平垂直位置,负数代表操作边框 *!*/
  background-color: #f3fff6;

  img {
    width: 100%; /* 这里是设置让图片宽高 都是 avatoar_box 的宽高 现在就是130 减去 pading的10所以就是120 图片高度120 */
    height: 100%;
    border-radius: 50%; /* 设置图片的边框弧度 ,如果设置为50% 这表示把图片取圆*/
    background-color: #e8eeeb; /* 设置图片透明部分的背景颜色 */
  }
}
</style>
