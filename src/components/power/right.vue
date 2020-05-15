<template>
    <!--    面包屑导航-->
    <div>
        <el-row :gutter="10">
            <el-col :span="24">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <!--        显示权限列表-->
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="rightlist" style="width: 100%" Boolean border stripe>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="authName" label="权限名称"></el-table-column>
                        <el-table-column prop="path" label="路径"></el-table-column>
                        <el-table-column prop="level" label="权限等级">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.level === '0' ">一级权限</el-tag>
                                <el-tag type="success" v-else-if="scope.row.level === '1' ">二级权限</el-tag>
                                <el-tag type="warning" v-else-if="scope.row.level === '2' ">三级权限</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  name: 'right',
  data () {
    return {
      // 权限列表
      rightlist: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res)
      // 如果返回状态不是200 ,则提示返回错误
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 否则就是返回了200 ,给权限列表 rightlist 赋值
      this.rightlist = res.data
    }
  }
}
</script>

<style scoped>

</style>
