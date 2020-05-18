<template>
  <div>
    <!--        面包屑导航-->
    <el-row :gutter="10" class="marginTopSpace">
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!--        显示商品分类列表-->
    <el-row>
      <el-col :span="24">
        <el-card class="box-card">
          <!--        添加商品分类按钮-->
          <div align="right">
            <el-button type="primary" @click="showCateFormFunction">添加商品分类</el-button>
          </div>
          <!--        显示分类信息-->
          <table-tree :data="cateList" :columns="columns" :expand-type="false" :selection-type="false" :show-index="true" index-text="#" :border="true">
            <!--            是否有效模板-->
            <template slot="isavliable" slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: #55a532"></i>
              <i class="el-icon-error" v-else-if="scope.row.cat_deleted === true" style="color: #bd2c00"></i>
            </template>
            <!--            排序模板-->
            <template slot="isorder" slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.cat_level === 0">一级分类</el-tag>
              <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级分类</el-tag>
              <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level === 2">三级分类</el-tag>
            </template>
            <!--            编辑删除操作-->
            <template slot="operator" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row)">
                编辑
              </el-button>
              <el-button type="danger" icon="el-icon-delete-solid" size="mini" @click="showDeleteCateDialog(scope.row.cat_id)">
                删除
              </el-button>
            </template>
          </table-tree>
          <!--          商品分类表格的分页-->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                         :page-sizes="pageSize" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <!--    添加分类按钮对话框-->
    <el-dialog title="提示" :visible.sync="AddCatedialogVisible" width="50%" @close="closeAddCateDialog">
      <!--      添加分类表单-->
      <el-form :model="addCateForm" :rules="addCateRules" ref="AddCateRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--          级联选择器 options 用来指定绑定的数据源-->
          <!--          props 用来配置显示的具体参数和样式-->
          <!--          v-model 用来保存 级联菜单所选择的数据ID 列表 必须是列表-->
          <!--          如果第一列数据较多,一定要在主CSS样式下加 .el-cascader-menu {height: 300px !important;}  否在将把页面拉升-->
          <el-cascader v-model="catesSelet" :options="parentCateList" :props="cateCascaderProps" clearable size="medium" placeholder="请选择分类" filterable @change="cateSelectFunction"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="postAddCateData">确 定</el-button>
      </span>
    </el-dialog>
    <!--    编辑按钮对话框-->
    <el-dialog title="更改分类名称" :visible.sync="editCatedialogVisible" width="30%" @close="closeEditCateDialog">
      <el-form :model="editCateForm" :rules="addCateRules" ref="editCateRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCateData">确 定</el-button>
  </span>
    </el-dialog>
    <!--    删除按钮对话框-->
    <el-dialog title="删除分类名称" :visible.sync="deleteCatedialogVisible" width="30%">
      <div align="center" class="set-delete-font-style"><span> 该分类名称删除以后将无法恢复,请确认是否删除该分类</span></div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deleteCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteCateData">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'categories',
  data () {
    return {
      // 获取所有商品列表
      cateList: [],
      // 商品列表查询条件
      pageSize: [5, 10, 25, 50],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总商品总数
      total: 0,
      // 是否显示添加分类对话框
      AddCatedialogVisible: false,
      // 是否显示编辑分类对话框
      editCatedialogVisible: false,
      // 是否显示删除分类对话框
      deleteCatedialogVisible: false,
      // 父级分类列表数据
      // 设置删除分类列表的ID
      deleteCateID: 0,
      parentCateList: [],
      // 修改分类名称
      editCateForm: {
        cat_id: 0,
        cat_name: ''
      },
      // 级联菜单绑定属性
      cateCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 级联菜单选择的数据列表
      catesSelet: [],
      // 添加分类表单
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加分类表单的验证规则
      addCateRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '分类名称的长度必须在 2 到 10 个字符',
            trigger: 'blur'
          }]
      },
      // 商品列表表格的列元素绑定
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 表示将当前列定义为模板列
        type: 'template',
        // 表示当前这一列所用的模板名称
        template: 'isavliable'
      }, {
        label: '分类排序',
        // 表示将当前列定义为模板列
        type: 'template',
        // 表示当前这一列所用的模板名称
        template: 'isorder'
      }, {
        label: '操作',
        type: 'template',
        template: 'operator'
      }]
    }
  },
  created () {
    // 设置第一次打开也买你时每页显示的条数
    this.queryInfo.pagesize = this.pageSize[0]
    this.getGoodCateList()
  },
  methods: {
    // 获取商品分类列表
    async getGoodCateList () {
      // get 请求的 参数必须是用params 进行指定
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 把数据保存到商品列表
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 设置每页显示多少条数据 获取每页显示多少条数pagesize
    handleSizeChange (pagesize) {
      this.queryInfo.pagesize = pagesize
      this.getGoodCateList()
    },
    // 当点击下一页或下一页是调用的方法 获取当前页指向 pagenum
    handleCurrentChange (currentpage) {
      this.queryInfo.pagenum = currentpage
      this.getGoodCateList()
    },
    // 显示添加分类对话框
    async showCateFormFunction () {
      this.getParentCateList()
      this.AddCatedialogVisible = true
    },
    // 关闭添加分类对话框
    closeAddCateDialog () {
      this.$refs.AddCateRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.catesSelet = []
    },
    // 获取父类分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.parentCateList = res.data
      // console.log(this.parentCateList)
    },
    // 级联菜单发生改变后调用
    cateSelectFunction () {
      console.log(this.catesSelet)
      if (this.catesSelet.length < 1) {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      } else {
        this.addCateForm.cat_pid = this.catesSelet[this.catesSelet.length - 1]
        this.addCateForm.cat_level = this.catesSelet.length
      }
    },
    // 提交添加分类对话框确认按钮
    postAddCateData () {
      this.$refs.AddCateRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入分类名称')
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加分类成功')
        this.getGoodCateList()
        this.getParentCateList()
        this.closeAddCateDialog()
        this.AddCatedialogVisible = false
      })
    },
    // 显示编辑分类对话框
    showEditCateDialog (cateInfo) {
      this.editCateForm.cat_id = cateInfo.cat_id
      this.editCateForm.cat_name = cateInfo.cat_name
      this.editCatedialogVisible = true
    },
    // 关闭编辑分类对话框
    closeEditCateDialog () {
      this.editCateForm.cat_id = 0
      this.$refs.editCateRef.resetFields()
    },
    // 提交编辑分类列表确认按钮
    editCateData () {
      this.$refs.editCateRef.validate(async valid => {
        if (!valid) return
        console.log(this.editCateForm)
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, this.editCateForm)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('该分类名称已被成功编辑')
        this.closeEditCateDialog()
        this.getGoodCateList()
        this.getParentCateList()
        this.editCatedialogVisible = false
      })
    },
    // 显示删除分类名称的对话框
    showDeleteCateDialog (deleteID) {
      this.deleteCateID = deleteID
      this.deleteCatedialogVisible = true
    },
    async deleteCateData () {
      const { data: res } = await this.$http.delete(`categories/${this.deleteCateID}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('该分类已被成功删除')
      this.getParentCateList()
      this.getGoodCateList()
      this.deleteCatedialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}

.set-delete-font-style {
  font-size: larger;
  color: red;
}
</style>
