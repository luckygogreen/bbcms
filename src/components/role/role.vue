<template>
    <div>
        <!--        面包屑导航-->
        <el-row :gutter="10">
            <el-col :span="24">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
                </el-breadcrumb>
            </el-col>
        </el-row>
        <!--        添加角色按钮-->
        <el-row type="flex" class="row-bg" justify="end">
            <el-col :span="2">
                <el-button type="primary" @click="showAddRole">添加新角色</el-button>
            </el-col>
        </el-row>
        <!--        显示角色列表-->
        <el-row>
            <el-col :span="24">
                <el-card class="box-card">
                    <!--        显示角色信息-->
                    <el-table :data="roleList" style="width: 100%" Boolean border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-row :class="['bolderBot','vcenter',index1 === 0 ? 'bolderTop' : '']" v-for="(item1, index1) in scope.row.children" :key="item1.id" bolder>
                                    <!--                                   渲染一级权限-->
                                    <el-col :span="5">
                                        <el-tag closable @close="removeRight(scope.row,item1.id)">{{ item1.authName
                                            }}<i class="el-icon-caret-right"></i></el-tag>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-row :class="['vcenter', index2 === 0 ? '':'bolderTop']" v-for="(item2, index2) in item1.children" :key="item2.id">
                                            <!--                                            渲染二级权限-->
                                            <el-col :span="6">
                                                <el-tag type="success" closable @close="removeRight(scope.row,item2.id)">
                                                    {{
                                                    item2.authName }}<i class="el-icon-caret-right"></i></el-tag>
                                            </el-col>
                                            <!--                                            渲染三级权限-->
                                            <el-col :span="18" class="vcenter">
                                                <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRight(scope.row,item3.id)">
                                                    {{ item3.authName }}
                                                </el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="roleName" label="角色名称"></el-table-column>
                        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                        <!--                                                用户的编辑和删除操作-->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRole(scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="showRightTreeDialog(scope.row)">
                                    分配权限
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <!--        编辑角色信息对话框-->
        <el-dialog title="编辑角色信息" :visible.sync="editRoleVisible" width="30%" center @close="closeEditRoleDialog">
            <el-form :model="editRole" :rules="editRoleRules" ref="editRoleRef" label-width="100px">
                <el-form-item label="角色ID">
                    <el-input v-model="editRole.id" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRole.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRole.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRoleConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--        添加新角色对话框-->
        <el-dialog title="添加角色信息" :visible.sync="addRoleVisible" width="30%" center @close="closeaddRoleDialog">
            <el-form :model="addRole" :rules="editRoleRules" ref="addRoleRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRole.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRole.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleConfirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--    列出所有权限对话框-->
        <el-dialog title="分配权限列表" :visible.sync="rightTreeDialogVisible" width="30%" center @close="closeRightTreeDialog">
            <el-tree
                    :data="rightTree"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="rightExpended"
                    :default-checked-keys="rightChecked"
                    :props="rightTreeProps"
                    default-expand-all ref="rightTreeRef">
            </el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="rightTreeDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleRight">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'role',
  data () {
    return {
      roleList: [],
      rightTree: [],
      rightExpended: [101, 103], // 如果使用 default-expand-all 全部展开节点,那么该控制将失效
      rightChecked: [],
      editRole: {},
      addRole: {},
      rightTreeProps: {
        children: 'children',
        label: 'authName'
      },
      editRoleRules: {
        roleName: [{
          required: true,
          message: '请输入角色名',
          trogger: 'blur'
        }, {
          min: 2,
          max: 10,
          message: '角色名长度必须在2-10位字符之间',
          trogger: blur
        }],
        roleDesc: [{
          required: true,
          message: '请输入角色描述',
          trogger: 'blur'
        }, {
          min: 3,
          max: 30,
          message: '角色描述长度必须在3-30位字符之间',
          trogger: blur
        }]
      },
      editRoleVisible: false,
      addRoleVisible: false,
      rightTreeDialogVisible: false,
      // 分配权限的ID
      roleID: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.roleList = res.data
    },
    // 显示编辑角色对话框
    showEditRole (roleInfo) {
      this.editRole = roleInfo
      this.editRoleVisible = true
    },
    // 关闭编辑对话框时清楚数据,并且重新创新角色列表
    closeEditRoleDialog () {
      this.$refs.editRoleRef.resetFields()
      this.getRolesList()
    },
    // 关闭添加角色对话框
    closeaddRoleDialog () {
      this.$refs.addRoleRef.resetFields()
      this.getRolesList()
    },
    // 确认提交编辑按钮
    editRoleConfirm () {
      this.$refs.editRoleRef.validate(async valid => {
        console.log(valid)
        if (valid) {
          const { data: res } = await this.$http.put('roles/' + this.editRole.id, {
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc
          })
          if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
          this.$message.success('角色信息已经编辑成功')
          this.getRolesList()
          this.editRoleVisible = false
        }
      })
    },
    // 删除角色
    async deleteRole (roleID) {
      const { data: res } = await this.$http.delete('roles/' + roleID)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('该角色已被成功删除')
      this.getRolesList()
    },
    // 显示添加角色对话框
    showAddRole () {
      this.addRoleVisible = true
    },
    // 确认添加新角色按钮
    addRoleConfirm () {
      this.$refs.editRoleRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addRole)
          // console.log(res)
          if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
          this.$message.success('添加角色成功')
          this.getRolesList()
          this.addRoleVisible = false
        }
      })
    },
    // 删除权限
    async removeRight (role, rightID) {
      // console.log(roleID)
      // console.log(rightID)
      console.log(role.children)
      const { data: res } = await this.$http.delete('roles/' + role.id + '/rights/' + rightID)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('该角色权限已被成功删除')
      role.children = res.data
      console.log(role.children)
      console.log(res.data)
    },
    // 显示分配权限的对话框
    async showRightTreeDialog (rightInfo) {
      this.roleID = rightInfo.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rightTree = res.data
      // console.log(this.rightTree)
      this.getRightByRole(rightInfo, this.rightChecked)
      this.rightTreeDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getRightByRole (rightInfo, array) {
      // 如果当前 rightInfo 节点不包含 children 属性，则是三级节点
      if (!rightInfo.children) {
        return array.push(rightInfo.id)
      }
      // 否在则继续 递归该函数 的下一级
      rightInfo.children.forEach(item => this.getRightByRole(item, array))
    },
    closeRightTreeDialog () {
      this.rightChecked = []
    },
    async setRoleRight (roleInfo) {
      //  如果想在控件中获取该控件的属性和方法 ,
      //  必须要为该控件添加一个引导
      //  相当于指向该控件的意思 这样才能被调用
      const newRight = [
        // this 前面的三个点时展开数据的意思[1,2,3,4,5],如果步输入...这会返回2个嵌套数组[[1,2],[3,4,5]]
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ]
      // console.log(newRight)
      // 将数组类型的数据[105, 116, 117, 101, 104] 转化成一个字符传,里面的值用英文逗号分割 "105,116,117,101,104"
      const newRightStr = newRight.join(',')
      // console.log(newRightStr)
      // const { data: res } = await this.$http.post('roles/' + this.roleID + '/rights', { rids: newRightStr }) // 通过拼接字符串
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: newRightStr }) // 通过${} 插入 用这种方法必须用反向单引号 `
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('角色权限修改成功')
      this.getRolesList()
      this.rightTreeDialogVisible = false
    }
  }
}
</script>

<style scoped>
.bolderTop {
    border-top: 1px solid #d8d8d8;
}

.bolderBot {
    border-bottom: 1px solid #D8D8D8;
}

.el-row {
    margin-top: 0px !important;
}

.el-tag {
    margin: 7px;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
