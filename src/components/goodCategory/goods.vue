<template>
  <div>
    <!--        面包屑导航-->
    <el-row :gutter="10" class="marginTopSpace">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!--  商品列表区-->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getGoods">
            <template slot="prepend">搜索商品名称</template>
          </el-input>
        </el-col>
        <el-button type="primary" @click="addGood">添加商品</el-button>
      </el-row>
      <el-row>
        <el-col>
          <el-table :data="goodsList" style="width: 100%" height="568" border stripe>
            <el-table-column type="index" width="60px" label="#" fixed/>
            <el-table-column prop="goods_name" label="商品名称"/>
            <el-table-column prop="goods_weight" label="重量" width="80" sortable/>
            <el-table-column prop="goods_number" label="数量" width="80" sortable/>
            <el-table-column prop="goods_price" label="价格" width="80" sortable/>
            <el-table-column prop="upd_time" label="更新时间" width="160">
              <template slot-scope="scope"><i class="el-icon-time"></i>{{ scope.row.upd_time | dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作" width="138">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" circle/>
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteGood(scope.row.goods_id)"/>
              </template>
            </el-table-column>
          </el-table>
          <!--          分页区-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                         :page-sizes="pageSize" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'goods',
  data () {
    return {
      // 查询商品列表参数
      queryInfo: {
        // 搜索条件
        query: '',
        // 显示当前页
        pagenum: 1,
        // 每页显示多少条
        pagesize: 10
      },
      // 设置每页显示数据区间
      pageSize: [5, 10, 15, 25],
      // 商品总是
      total: 0,
      // 商品列表
      goodsList: []
    }
  },
  created () {
    // this.getGoods().then(this.printData)
    this.getGoods()
  },
  methods: {
    // 调用接口获取商品列表
    async getGoods () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success('商品列表加载成功')
      // console.log(res.data.goods)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 测试打印绑定数据
    printData () {
      console.log(this.goodsList)
      console.log(this.total)
    },
    // 分页 每页显示多少条
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getGoods()
    },
    // 分页 显示当前页
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getGoods()
    },
    // 删除商品
    async deleteGood (goodID) {
      const confirmStr = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmStr)
      if (confirmStr === 'confirm') {
        const { data: res } = await this.$http.delete(`goods/${goodID}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('该商品已被成功删除')
        this.getGoods()
      }
    },
    // 添加商品按钮
    addGood () {
      // 跳转到goods/add页面
      this.$router.push('goods/add')
    }
  },

  computed: {}
}
</script>

<style lang="less" scoped>

</style>
