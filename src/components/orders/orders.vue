<template>
  <div>
    <!--        面包屑导航-->
    <el-row :gutter="10" class="marginTopSpace">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <!--          查询订单输入框-->
          <el-input placeholder="请输入订单号" v-model="queryInfo.query" style="width: 320px;" @change="searchOrder">
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
          <!--         显示订单列表-->
          <el-table :data="orderList" border stripe>
            <el-table-column type="index" label="#"/>
            <el-table-column prop="order_number" label="订单编号"/>
            <el-table-column prop="order_price" label="订单价格"/>
            <el-table-column prop="order_pay" label="是否付款">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.order_pay === '1'">已付款</el-tag>
                <el-tag type="danger" v-else>未付款</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货"/>
            <el-table-column prop="create_time" label="下单时间">
              <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <el-button size="mini" type="primary" @click="showEditDialog">编辑</el-button>
              <el-button size="mini" type="success" @click="showCheckDialog">跟踪</el-button>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!--    编辑订单对话框-->
    <el-dialog title="修改订单地址" :visible.sync="orderEditDialogVisible" width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="casProps" style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="orderEditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="orderEditDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--    订单跟踪对话框-->
    <el-dialog :visible.sync="orderCheckDialogVisible" width="50%">
      <el-timeline reverse>
        <el-timeline-item v-for="(activity, index) in tansData" :key="index" :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import CityJson from './citydata'

export default {
  name: 'orders',
  data () {
    return {
      // 物流进度
      tansData: [],
      // 地址
      addressForm: {
        address1: [],
        address2: ''
      },
      // 验证地址:
      addressFormRules: {
        address1: [
          {
            required: true,
            message: '请选择省市区县',
            trigger: 'blur'
          }
        ],
        address2: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: 'blur'
          }
        ]
      },
      // 级联菜单属性
      casProps: {
        value: 'value',
        label: 'label',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 绑定联动地址JSON数据
      cityData: CityJson,
      // 控制订单跟踪对话框的显示和隐藏
      orderCheckDialogVisible: false,
      // 控制订单编辑对话框的显示和隐藏
      orderEditDialogVisible: false,
      // 订单数据列表总过的条数
      total: 0,
      // 双向绑定订单列表的数据
      orderList: [],
      // 查询订单列表的参数字典
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res.data)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 显示定位对话框
    showCheckDialog () {
      this.orderCheckDialogVisible = true
      this.getTransData()
    },
    // 查询物流信息
    async getTransData () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      this.tansData = res.data
    },
    // 显示编辑对话框
    showEditDialog () {
      this.orderEditDialogVisible = true
    },
    // 查询订单
    searchOrder () {
      console.log(this.queryInfo.query)
      this.getOrderList()
    }
  },
  computed: {}
}
</script>

<style scoped>

</style>
