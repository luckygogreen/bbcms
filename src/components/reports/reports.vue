<template>
  <div>
    <!--        面包屑导航-->
    <el-row :gutter="10" class="marginTopSpace">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 100%;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'

export default {
  name: 'orders',
  data () {
    return {
      chartData: {},
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#2b2e30'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      allData: {}
    }
  },
  // created是在页面所有元素渲染之前,加载执行函数 与mounted正好相反
  created () {
  },
  methods: {},
  // mounted在页面的所有元素加载完以后才执行的函数
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 指定图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.chartData = res.data
    // 使用刚指定的配置项和数据显示图表。
    // 使用深加载lodash中的 合并为一个新的数据
    this.allData = _.merge(this.chartData, this.options)
    console.log(this.chartData)
    console.log(this.options)
    console.log(this.allData)
    myChart.setOption(this.allData)
  },
  computed: {}
}
</script>

<style scoped>

</style>
