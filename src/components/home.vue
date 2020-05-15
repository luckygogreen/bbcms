<template>
    <el-container class="home-container">
        <!-- 如果 isCollapse 是 ture 边栏宽度为64px 否在边栏宽度为200px -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
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
                    <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"  @click="saveNavState('/'+subitem.path)">
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
                    <img class="logo-class" src="../assets/logo.png" alt="">
                    <span>Vue + Element Ui 后台管理</span>
                </div>
                <el-button type="info" @click="logout">退出</el-button>
            </el-header>
            <el-main>
                <router-view></router-view>
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
</style>
