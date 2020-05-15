<template>
    <!--    面包屑导航-->
    <div>
        <el-row :gutter="10">
            <el-col :span="24">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>用户</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <!--    搜索输入和添加用户-->
        <el-row :gutter="10">
            <el-col :span="8">
                <el-input placeholder="请输入用户名" v-model="queryInfo.query" clearable @clear="getUsersList" @change="getUsersList">
                    <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                </el-input>
            </el-col>
            <el-col :span="3">
                <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
                <!--                @close="closeDialog" 对话框关闭后清空表单数据-->
                <!--                添加新用户对话框-->
                <el-dialog title="添加新用户" :visible.sync="dialogVisible" width="30%" center @close="closeDialog">
                    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="addForm.mobile"></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
                </el-dialog>
            </el-col>
        </el-row>
        <!--        显示用户信息-->
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <el-table :data="userlist" style="width: 100%" Boolean border>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="mobile" label="电话"></el-table-column>
                        <el-table-column prop="role_name" label="角色"></el-table-column>
                        <el-table-column label="状态">
                            <!--                            作用域插槽的概念-->
                            <template slot-scope="scope">
                                <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <!--                                                用户的编辑和删除操作-->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialogVisible(scope.row)"></el-button>
                                <!--                修改用户信息对话框-->
                                <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="30%" center @close="editCloseDialog">
                                    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
                                        <el-form-item label="用户名" prop="username">
                                            <el-input v-model="editForm.username" disabled></el-input>
                                        </el-form-item>
                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="editForm.email"></el-input>
                                        </el-form-item>
                                        <el-form-item label="手机号" prop="mobile">
                                            <el-input v-model="editForm.mobile"></el-input>
                                        </el-form-item>
                                    </el-form>
                                    <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
                                </el-dialog>
                                <el-tooltip effect="dark" :content="'为用户'+scope.row.username+'分配角色'" placement="top" :enterable="false">
                                    <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
                                </el-tooltip>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                    <!--                    用户显示分页部分-->
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
                                   :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                                   layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-card>
            </el-col>
        </el-row>
        <!--        为用户分配权限的对话框-->
        <el-dialog
                title="权限分配对话框"
                :visible.sync="setUserRoledialogVisible"
                width="30%" @close="removeUserRoleID">
            <div align="center">
                <p>用户名 : {{userDetails.username}}</p>
                <p>当前角色 : {{userDetails.role_name}}</p>
                <p>分配新角色 :
                    <el-select v-model="selectRoleID" placeholder="请选择角色">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setUserRoledialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleRight">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'user',
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表的参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 获取用户列表
      userlist: [],
      // 总用户数
      total: 0,
      // 是否显示添加用户弹框
      dialogVisible: false,
      editDialogVisible: false,
      setUserRoledialogVisible: false,
      userDetails: {},
      rolesList: [],
      selectRoleID: '',
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trogger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '用户名长度必须在3-10位字符之间',
          trogger: blur
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trogger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '密码长度必须在6-15位字符之间',
          trogger: blur
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trogger: 'blur'
        }, {
          min: 3,
          max: 50,
          message: '邮箱长度必须在3-50位字符之间',
          trogger: blur
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trogger: 'blur'
        }, {
          min: 3,
          max: 12,
          message: '手机号长度必须在3-12位字符之间',
          trogger: blur
        }, {
          validator: checkMobile,
          trigger: 'blur'
        }]
      },
      editFormRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trogger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '用户名长度必须在3-10位字符之间',
          trogger: blur
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trogger: 'blur'
        }, {
          min: 3,
          max: 50,
          message: '邮箱长度必须在3-50位字符之间',
          trogger: blur
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trogger: 'blur'
        }, {
          min: 3,
          max: 12,
          message: '手机号长度必须在3-12位字符之间',
          trogger: blur
        }, {
          validator: checkMobile,
          trigger: 'blur'
        }]
      }
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表
    async getUsersList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message(res.meta.msg)
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听每页显示多少条
    handleSizeChange (pageSize) {
      this.queryInfo.pagesize = pageSize
      this.getUsersList()
    },
    // 监听 页码值改变
    handleCurrentChange (currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getUsersList()
    },
    // 修改用户的状态
    async changeUserState (userInfo) {
      console.log(userInfo.id)
      console.log(userInfo.mg_state)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      if (res.meta.status === 200) {
        return this.$message.success(res.meta.msg)
      }
    },
    // 用于在对话框关闭的时候清空表单数据
    closeDialog () {
      this.$refs.addFormRef.resetFields()
      this.getUsersList()
    },
    editCloseDialog () {
      this.$refs.editFormRef.resetFields()
    },
    // 添加用户操作
    addUser () {
      // 验证表单是否全部填写完成
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return this.$message.error('请正确填写新用户信息')
        // 发起添加新用户的API 接口请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // 判断是否添加成功
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        // 关闭添加用户对话框
        this.dialogVisible = false
        this.$message.success('添加用户成功')
        // 重新刷新用户列表
        this.getUsersList()
      })
    },
    // 显示编辑用户对话框
    showEditDialogVisible (userInfo) {
      // 对象数据,会根据对象的Key  逐个匹配,
      this.editForm = userInfo
      // 下面的三个赋值 就等于上面的一条赋值信息
      // this.editForm.username = userInfo.username
      // this.editForm.email = userInfo.email
      // this.editForm.mobile = userInfo.mobile
      this.editDialogVisible = true
    },
    // 编辑用户信息
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        // 验证用户输入的信息是否正确
        if (!valid) return this.$message.error('请正确输入用户信息')
        // 提交编辑后的表单信息
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('无法编辑该用户信息')
        this.$message.success('用户' + this.editForm.username + '的信息已经修改成功')
        this.editDialogVisible = false
        this.getUsersList()
      })
    },
    // 删除用户
    async deleteUser (userID) {
      const confrimRes = await this.$confirm('此操作将永久删除该用户且无法还原, 是否继续?', '删除用户提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 上面的 catch(err => err) 就等于  catch(err){ return err}
      console.log(confrimRes)
      if (confrimRes === 'confirm') {
        // 调用接口 ,执行删除操作
        const { data: res } = await this.$http.delete('users/' + userID)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('该用户已经成功被删除')
        this.getUsersList()
      }
    },
    async showSetRoleDialog (userInfo) {
      // 绑定用户基本信息,用于显示基本信息
      this.userDetails = userInfo
      // 获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      // 为数据绑定的角色列表赋值
      this.rolesList = res.data
      // 弹出修改角色对话框
      this.setUserRoledialogVisible = true
    },
    // 确认分配新新角色
    async saveRoleRight () {
      if (!this.selectRoleID) {
        return this.$message.error('请选择要分配的角色！')
      }
      const { data: res } = await this.$http.put(`users/${this.userDetails.id}/role`, { rid: this.selectRoleID })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新权限成功')
      this.getUsersList()
      this.setUserRoledialogVisible = false
    },
    removeUserRoleID () {
      this.selectRoleID = ''
    }
  }
}
</script>

<style scoped>

</style>
