<template>
  <div>
    <!--        面包屑导航-->
    <el-row :gutter="10" class="marginTopSpace">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!--        显示商品分类列表-->
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <!--          温馨提示对话框-->
          <el-row>
            <el-col :span="24">
              <el-alert title="请注意:目前只支持三级分类设置属性" type="warning" effect="dark" show-icon></el-alert>
            </el-col>
          </el-row>
          <!--          选择商品分类的级联选项卡-->
          <el-row class="row-margin-style">
            <el-col :span="24">
              <el-cascader v-model="selectCate" :options="cateList" :props="cateProps" @change="cateCasChange" placeholder="请选择对应属性的商品分类"></el-cascader>
            </el-col>
          </el-row>
          <!--          编辑商品分类属性-->
          <el-row>
            <el-col>
              <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
                <el-tab-pane label="动态参数" name="many">
                  <!--                  添加动态参数按钮-->
                  <el-button :disabled="showThisButtons" type="primary" @click="addDialogVisible = true">添加动态参数
                  </el-button>
                  <!--                  动态参数表格-->
                  <el-table :data="manyParamsList" border v-if="manyParamsList.length > 0 ">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <!--                        循环渲染动态参数下面的Tag标签-->
                        <el-tag v-for="(ele,index) in scope.row.attr_vals" :key="index" closable @close="deleteHandleTag(scope.row,index)">
                          {{ele}}
                        </el-tag>
                        <!--                        输入和添加动态参数下面的Tag标签的切换效果-->
                        <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+添加参数标签
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deletePaparmDialog(scope.row.attr_id)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                  <el-button :disabled="showThisButtons" type="primary" @click="addDialogVisible = true">添加动态参数
                  </el-button>
                  <!--                  静态属性表格-->
                  <el-table :data="onlyParamsList" border v-if="onlyParamsList.length > 0 ">
                    <el-table-column type="expand">
                      <template slot-scope="scope">
                        <!--                        循环渲染动态参数下面的Tag标签-->
                        <el-tag v-for="(ele,index) in scope.row.attr_vals" :key="index" closable @close="deleteHandleTag(scope.row,index)">
                          {{ele}}
                        </el-tag>
                        <!--                        输入和添加动态参数下面的Tag标签的切换效果-->
                        <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+添加参数标签
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column type="index" label="#"></el-table-column>
                    <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="deletePaparmDialog(scope.row.attr_id)">
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!--    添加动静态参数的对话框-->
    <el-dialog :title="'添加'+TitleText" :visible.sync="addDialogVisible" width="30%" @close="closeAddForm">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddPaparms">确 定</el-button>
      </span>
    </el-dialog>
    <!--    编辑动静态参数的对话框-->
    <el-dialog :title="'编辑'+TitleText" :visible.sync="editDialogVisible" width="30%" @close="closeEditForm">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="TitleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditPaparms">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 设置是否显示 添加属性按钮
      showThisButtons: true,
      // 设置被选择的分类属性tab标签
      activeTabName: 'many',
      // 是否显示添加参数对话框
      addDialogVisible: false,
      editDialogVisible: false,
      // 总商品分类数
      total: 0,
      // 级联选择框的所选分类ID数组
      selectCate: [],
      // 储存对应ID的动态many参数列表
      manyParamsList: [],
      // 储存对应ID的静态only参数列表
      onlyParamsList: [],
      // 添加参数表单
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_id: 0,
        attr_name: '',
        attr_sel: '',
        attr_vals: ''
      },
      // 添加表单规则
      addFormRules: {
        attr_name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }, {
          min: 2,
          max: 10,
          message: '名称的长度必须在 2 到 10 个字符',
          trigger: 'blur'
        }]
      },
      // 获取级联菜单显示属性
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // checkStrictly: true,
        expandTrigger: 'hover'
      }
    }
  },
  created () {
    this.getGoodCateList()
  },
  computed: {
    TitleText () {
      if (this.activeTabName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  },
  methods: {
    // 获取商品分类列表
    async getGoodCateList () {
      // get 请求的 参数必须是用params 进行指定
      const { data: res } = await this.$http.get('categories')
      // console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 把数据保存到商品列表
      this.cateList = res.data
      this.total = res.data.total
    },
    // 级联分类列表选择后触发的事件
    cateCasChange () {
      // console.log(this.cateList)
      if (this.selectCate.length !== 3) {
        this.selectCate = []
        this.showThisButtons = true
        this.manyParamsList = []
        this.onlyParamsList = []
        return this.$message.error('对应分类的属性必须是三级分类才可以被设置')
      }
      // 开启添加动静态属性的按钮
      this.showThisButtons = false
      this.getManyList('many')
      this.getManyList('only')
    },
    // 判断列表参数对应标签改变时触发的事件
    handleTabClick () {
      // if (this.activeTabName === 'many') {
      //   console.log(this.manyParamsList)
      // } else {
      //   console.log(this.onlyParamsList)
      // }
      // this.getManyList(this.activeTabName)
    },
    // 获取对应ID的分类参数列表
    async getManyList (sel) {
      if (this.selectCate.length === 3) {
        console.log('查询数据库')
        const SeleteCateID = this.selectCate[this.selectCate.length - 1]
        // console.log(this.selectCate)
        // console.log(SeleteCateID)
        const { data: res } = await this.$http.get(`categories/${SeleteCateID}/attributes`, { params: { sel: sel } })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 循环每个对象
        res.data.forEach(item => {
          // 将attr_vals 的字符串字段，拼接成已空格分割的数组
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // 调整 动态参数下面的Tag标签 是否显示添加文本框 默认不显示， 当输入文本框不显示的时候 提示添加的标签将会显示
          item.inputVisible = false
          // 动态参数下面的Tag 输入文本框绑定的值
          item.inputValue = ''
        })
        if (sel === 'many') {
          console.log(res.data)
          this.manyParamsList = res.data
        } else {
          this.onlyParamsList = res.data
        }
      }
    },
    // 关闭添加参数对话框的事件
    closeAddForm () {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭编辑对话框的事件
    closeEditForm () {
      this.$refs.editFormRef.resetFields()
    },
    // 确认提交编辑对话框的事件
    confirmEditPaparms () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.editForm.attr_sel,
          attr_vals: this.editForm.attr_vals.join(' ')
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('该参数已被成功修改')
        this.editForm.attr_id = 0
        this.editForm.attr_name = ''
        this.editForm.attr_sel = ''
        this.editForm.attr_vals = ''
        this.cateCasChange()
        this.editDialogVisible = false
      })
    },
    // 删除动静态参数属性 （直接删除版本，没有友好提示确认删除）
    // async deletePaparmDialog (deleteID) {
    //   const { data: res } = await this.$http.delete(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${deleteID}`)
    //   if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    //   this.cateCasChange()
    //   this.$message.success('该参数已经被成功删除')
    // },
    // 删除动静态参数属性  （有是否确认删除的友好提示框）
    async deletePaparmDialog (deleteID) {
      const confrimFlag = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confrimFlag)
      if (confrimFlag === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${deleteID}`)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.cateCasChange()
        this.$message.success('该参数已经被成功删除')
      }
    },
    // 确认添加参数事件
    confirmAddPaparms () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeTabName
        })
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('成功添加' + this.TitleText)
        // this.getGoodCateList()
        this.cateCasChange()
        this.addDialogVisible = false
      })
    },
    // 显示编辑属性对话框
    showEditDialog (paparmInfo) {
      console.log(paparmInfo)
      this.editForm.attr_id = paparmInfo.attr_id
      this.editForm.attr_name = paparmInfo.attr_name
      this.editForm.attr_sel = paparmInfo.attr_sel
      this.editForm.attr_vals = paparmInfo.attr_vals
      this.editDialogVisible = true
    },
    // 当动态参数文本框输入完数据，点击Enter 或者 失去焦点时候 触发的事件
    handleInputConfirm (row) {
      // 用来判断用户是否输入空格或者空数据
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.addManyTags(row)
      // 如果用户输入了有效数据则执行如下代码
      // row.attr_vals.push(row.inputValue.trim())
      // const { data: res } = await this.$http.put(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${row.attr_id}`, {
      //   attr_name: row.attr_name,
      //   attr_sel: row.attr_sel,
      //   attr_vals: row.attr_vals.join(' ')
      // })
      // if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // this.$message.success('标签【' + row.inputValue.trim() + '】添加成功')
      // row.inputValue = ''
      // row.inputVisible = false
    },
    // 添加动态参数下面的标签方法
    async addManyTags (row) {
      const { data: res } = await this.$http.put(`categories/${this.selectCate[this.selectCate.length - 1]}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      row.inputValue = ''
      row.inputVisible = false
    },
    // 删除动态参数下面的标签方法
    deleteHandleTag (row, index) {
      console.log('in')
      console.log(index)
      // splice(index,howmany,newitem1,newitem2) 方法向/从数组中添加/删除项目，然后返回被删除的项目
      // 其中index 必填。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。起始位置为0
      // howmany 必填，整数 总共删除多少条数据
      // newitem1,newitem2 添加的新数据
      // 返回值是一个操作后的新数组
      row.attr_vals.splice(index, 1)
      this.addManyTags(row)
    },
    // 当点击添加参数标签时触发的事件
    showInput (row) {
      row.inputVisible = true
      // 让动态参数下面的添加标签按钮，点击后弹出的输入框自动获取焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
      // （简单的说就当点击完添加按钮以后，等输入文本框弹显示并且全部样式加载完以后，才能调用这个获得焦点的方法）
      this.$nextTick(_ => {
        // console.log(this.$refs)
        // console.log(this.$refs.saveTagInput)
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.row-margin-style {
  margin: 15px 0px;
}

.el-cascader {
  width: 100%;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 150px;
}
</style>
