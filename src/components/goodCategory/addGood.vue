<template>
  <div>
    <!--        面包屑导航-->
    <el-row :gutter="10" class="marginTopSpace">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!--    添加商品区-->
    <el-row>
      <el-col :span="24">
        <el-card>
          <!--          友好提示信息-->
          <el-alert :title="showProcessMessage" type="info" center show-icon>
          </el-alert>
          <!--          进度显示区-->
          <el-steps :active="stepNumber-0" finish-status="success" style="margin-top: 10px" align-center>
            <el-step title="基本信息"/>
            <el-step title="商品参数"/>
            <el-step title="商品属性"/>
            <el-step title="商品图片"/>
            <el-step title="商品内容"/>
            <el-step title="完成"/>
          </el-steps>
          <!--          用户添加商品信息区-->
          <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="100px" class="demo-ruleForm" label-position="top">
            <!--            左侧Tab标签-->
            <el-tabs tab-position="left" type="border-card" v-model="stepNumber" :before-leave="beforeLeave" @tab-click="tabClickFunction">
              <el-tab-pane label="基本信息" name="0">
                <el-form-item label="请选择分类" prop="goods_cat">
                  <el-cascader v-model="selectedMenu" :options="cateList" :props="selectedProps" @change="selectedMenuHandleChange" hover/>
                </el-form-item>
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addGoodForm.goods_name"/>
                </el-form-item>
                <el-form-item label="价格" prop="goods_price">
                  <el-input v-model="addGoodForm.goods_price" type="number"/>
                </el-form-item>
                <el-form-item label="重量" prop="goods_weight">
                  <el-input v-model="addGoodForm.goods_weight" type="number"/>
                </el-form-item>
                <el-form-item label="数量" prop="goods_number">
                  <el-input v-model="addGoodForm.goods_number" type="number"/>
                </el-form-item>
              </el-tab-pane>
              <!--              动态商品参数-->
              <el-tab-pane label="商品参数" name="1">
                <el-form-item v-for="(item) in manyAttrList" :label="item.attr_name" :key="item.attr_id">
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox v-for="(item,index) in item.attr_vals" :key="index" :label="item" border/>
                  </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <!--              静态商品属性-->
              <el-tab-pane label="商品属性" name="2">
                <el-form-item v-for="(item) in onlyAttrList" :label="item.attr_name" :key="item.attr_id">
                  <el-input v-model="item.attr_vals"/>
                </el-form-item>
              </el-tab-pane>
              <!--              上传商品图片-->
              <el-tab-pane label="商品图片" name="3">
                <el-form-item>
                  <el-upload :action="uploadUrl" list-type="picture-card"
                             :on-preview="handlePicCardPreview" :on-remove="PichandleRemove" :headers="tokenHealder" :on-success="successPicUpload">
                    <i class="el-icon-plus"></i></el-upload>
                </el-form-item>
              </el-tab-pane>
              <!--              商品内容区域,用到富文本编辑器-->

              <el-tab-pane label="商品内容" name="4">
                <el-form-item>
                  <quill-editor v-model="addGoodForm.goods_introduce"></quill-editor>
                </el-form-item>
                <div align="right">
                  <el-button type="primary" icon="el-icon-plus" @click="addGood">提交商品</el-button>
                </div>
              </el-tab-pane>
              <!--              前进后退按钮,未完成-->
              <!--              <div align="right">-->
              <!--                <el-button type="primary" icon="el-icon-arrow-left" @click="preTab" v-show="tabButton">上一项</el-button>-->
              <!--                <el-button type="primary" @click="nextTab" v-show="tabButton">-->
              <!--                  下一项<i class="el-icon-arrow-right el-icon&#45;&#45;right"/>-->
              <!--                </el-button>-->
              <!--                <el-button type="success" icon="el-icon-s-promotion" @click="submitAddGoodForm" v-show="submitButton">-->
              <!--                  提交-->
              <!--                </el-button>-->
              <!--              </div>-->
            </el-tabs>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!--    图片预览对话框-->
    <el-dialog title="提示" :visible.sync="imageDialogVisible" width="50%">
      <img :src="imageUrl" width="100%">
    </el-dialog>
  </div>
</template>

<script>
// import _ from 'lodash'

export default {
  name: 'addGood',
  data () {
    return {
      // 控制是否显示图片预览对话框
      imageDialogVisible: false,
      // 绑定图片预览URL
      imageUrl: '',
      // API接口的绝对路径+上传图片路径
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 带有token的Header请求头文件
      tokenHealder: { Authorization: window.sessionStorage.getItem('token') },
      // 上一个下一个tab 按钮显示操作
      tabButton: true,
      // 提交添加表单按钮显示操作
      submitButton: false,
      // 判断数据是否填入完整
      isDataOk: true,
      // 绑定数据商品分类
      cateList: [],
      // 动态参数列表
      manyAttrList: [],
      // 静态属性列表
      onlyAttrList: [],
      // 级联菜单选定的商品分类
      selectedMenu: [],
      // 级联菜单的配置属性
      selectedProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 友好提示框的信息
      showProcessMessage: '请输完善商品的基本信息',
      // 设置完成到了哪一步
      stepNumber: '0',
      // 添加表单绑定的数据
      addGoodForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []

      },
      // 验证表单绑定的数据
      addGoodFormRules: {
        goods_name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }, {
          min: 2,
          max: 60,
          message: '长度必须在 2 到 60 个字符',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '请输入重量',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true,
          message: '请输入数量',
          trigger: 'blur'
        }],
        goods_cat: [{
          required: true,
          message: '分类不能为空',
          trigger: 'blur'
        }]
      },
      // 已上传图片列表
      uploadPicView: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // console.log(res.data)
      this.cateList = res.data
    },
    // 级联菜单选定后给添加表单赋值
    selectedMenuHandleChange () {
      // console.log(this.selectedMenu)
      if (this.selectedMenu.length !== 3) {
        this.selectedMenu = []
        this.$message.error('非三级菜单无法选中,请补全第三级菜单后再做操作')
        return
      }
      this.addGoodForm.goods_cat = this.selectedMenu.join(',')
      // console.log(this.addGoodForm.goods_cat)
    },
    // // 判断数据是否完整
    // isDataCorrent () {
    // }
    // 离开Tab标签触发的钩子函数
    beforeLeave (nextActiveName, CurrentActiveName) {
      // console.log('跳转' + nextActiveName)
      // console.log('当前' + CurrentActiveName)
      if (CurrentActiveName === '0') {
        // console.log('A')
        if (this.selectedMenu.length !== 3 || this.addGoodForm.goods_name === '') {
          // console.log('B')
          this.$message.error('请完善该页信息')
          return false
        }
      }
    },
    // // 上一项按钮
    // preTab () {
    //   if (this.stepNumber !== '0') {
    //     if (this.isDataOk) {
    //       var tempDown = parseInt(this.stepNumber)
    //       tempDown -= 1
    //       this.stepNumber = tempDown + ''
    //       // console.log(tempDown)
    //       // console.log(typeof tempDown)
    //     } else {
    //       this.$message.error('请完善该页信息')
    //       this.isDataOk = true
    //     }
    //   } else {
    //     this.$message.error('已到达第一项')
    //   }
    // },
    // // 下一下按钮
    // nextTab () {
    //   if (this.stepNumber !== '4') {
    //     if (this.isDataOk) {
    //       var tempUp = parseInt(this.stepNumber)
    //       tempUp += 1
    //       this.stepNumber = tempUp + ''
    //       // console.log(tempUp)
    //       // console.log(typeof tempUp)
    //     } else {
    //       this.$message.error('请完善该页信息')
    //       this.isDataOk = true
    //     }
    //   } else {
    //     this.$message.error('已到达第最后项')
    //   }
    // },
    // 提交添加商品表单按钮
    // 切换tab后调用的方法
    tabClickFunction () {
      // console.log(this.stepNumber)
      if (this.stepNumber === '1') {
        this.getAttrList('many')
      }
      if (this.stepNumber === '2') {
        this.getAttrList('only')
      }
    },
    // 获取指定分类的动态参数
    async getAttrList (type) {
      const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, { params: { sel: type } })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      if (type === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyAttrList = res.data
      }
      if (type === 'only') {
        this.onlyAttrList = res.data
        // console.log(res.data)
      }
    },
    // 上传图片中的 预览图片方法
    handlePicCardPreview (pic) {
      console.log(pic.response)
      this.imageUrl = pic.response.data.url
      this.imageDialogVisible = true
    },
    // 上传图片中的 删除图片方法
    PichandleRemove (pic) {
      // console.log(pic.response)
      const picTempPath = pic.response.data.tmp_path
      // 获得 当前对象的匹配索引值,index => index.pic === picTempPath  相当于 function(x){if (x.pic === picTempPath){return x}}
      const i = this.addGoodForm.pics.findIndex(index => index.pic === picTempPath) // 下面注释部分是箭头方法的解释
      // const i = this.addGoodForm.pics.findIndex(function (x) {
      //   if (x.pic === picTempPath) {
      //     return x
      //   }
      // })
      // console.log(i)
      // splice 方法删除索引对应的值,然后把删除后的结果在赋值回去,非常好用的常用方法
      this.addGoodForm.pics.splice(i, 1)
      console.log(this.addGoodForm.pics)
    },
    // 获得上传文件的返回相应
    successPicUpload (response) {
      // console.log(response.data)
      const tempPic = { pic: response.data.tmp_path }
      this.addGoodForm.pics.push(tempPic)
      this.uploadPicView.push(response.data.url)
    },
    // 提交商品表单按钮事件
    addGood () {
      this.$refs.addGoodFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完成必填信息')
        // 深拷贝  lodash cloneDeep(obj)
        // const tempForm = _.cloneDeep(this.addGoodForm) // 由于在选中菜单以后,已经给goods_cat转换格式,所以这里没有用上
        // // tempForm.goods_cat = tempForm.goods_cat.join(',')
        this.manyAttrList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addGoodForm.attrs.push(newInfo)
        })
        this.onlyAttrList.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addGoodForm.attrs.push(newInfo)
        })
        // console.log(this.addGoodForm)
        // API 提交数据
        const { data: res } = await this.$http.post('goods', this.addGoodForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('商品添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateID () {
      if (this.selectedMenu.length === 3) {
        return this.selectedMenu[2] + 0
      } else {
        return null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs {
  margin: 15px 0px;
}

.el-cascader {
  width: 100%;
}

.el-checkbox {
  margin: 0px 10px 0px 0px !important;
}
</style>
