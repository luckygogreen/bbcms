<template>
    <el-container class="home-container">
        <el-aside width="200px">Aside</el-aside>
        <el-container>
            <el-header>
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
.home-container {
    height: 100%;
}
.el-container {
    background-color: #999999;
}
.el-header {
    background-color: #2b4b6b;
}
.el-aside {
    background-color: #333333;
}
.el-footer {
    background-color: #2b4b6b;
}
</style>
