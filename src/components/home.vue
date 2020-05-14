<template>
    <el-container class="home-container">
        <el-aside width="200px">
            <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
                <!--                一级导航-->
                <el-submenu index="1">
                    <!--                    一级导航模板-->
                    <template slot="title">
                        <!--                        一级导航图标-->
                        <i class="el-icon-location"></i>
                        <!--                        一级导航文本-->
                        <span>导航一</span>
                    </template>
                    <!--                    二级导航-->
                    <el-menu-item index="1-1">
                        <!--                        二级导航模板-->
                        <template slot="title">
                            <!--                            二级导航图标-->
                            <i class="el-icon-location"></i>
                            <!--                            二级导航文本-->
                            <span>导航一</span>
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
            <el-main>Main</el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message({
        message: '您已成功退出,如需访问请重新登录',
        type: 'success'
      })
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
</style>
