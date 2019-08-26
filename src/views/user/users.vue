<template>
  <div class="usersList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userObj.query"
        class="input-with-select"
        @input.native="init"
        style="width:300px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button
        type="success"
        style="margin-left: 10px;"
        @click="addDialogFormVisible=true"
        plain
      >添加用户</el-button>
    </div>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" :label-width="'80px'" :rules="rules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off" placeholder="请输入用邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <!-- 索引 -->
      <el-table-column type="index" width="50"></el-table-column>
      <!-- 姓名 -->
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <!-- 邮箱 -->
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <!-- 电话 -->
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <!-- 用户状态 -->
      <el-table-column label="用户状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeState(scope.row.id,scope.row.mg_state)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogTableVisible">
      <el-form :model="editForm" :label-width="'80px'" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled style="width:80px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="edituser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配 -->
    <el-dialog title="角色分配" :visible.sync="grantDialogFormVisible">
      <el-form :model="grantForm" :label-width="'80px'">
        <el-form-item label="用户名" style="width:200px">
          <span>{{grantForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="grantForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <div class="block" style="margin-top:15px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userObj.pagenum"
        :page-sizes="[1,2,3,4]"
        :page-size="userObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getAllUsers,
  addUser,
  editUser,
  updataUserState,
  grantUserRole,
  delUserById
} from '@/api/user_index.js'
import { getAllRoleList } from '@/api/role_index.js'
export default {
  data () {
    return {
      roleList: [],
      grantDialogFormVisible: false,
      grantForm: {
        username: '',
        id: '',
        rid: ''
      },
      editDialogTableVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: blur
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: blur
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: blur
          },
          {
            // 添加正则表达式
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: blur
          },
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      status: true, // 这个在哪里用到了?
      // userkey: '',
      userList: [],
      total: 0,
      userObj: {
        query: '', // 查询参数
        pagenum: 1,
        pagesize: 2
      }
    }
  },
  methods: {
    // 根据id删除角色
    delUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 调用接口实现分配角色
    grantUser () {
      if (this.grantForm.rid) {
        grantUserRole(this.grantForm)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.grantDialogFormVisible = false
              this.init()
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.success('用户编辑失败')
          })
      } else {
        this.$message.error('请选择角色')
      }
    },
    // 点击打开角色分配框
    showGrantDialog (row) {
      console.log(row)
      this.grantDialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      this.grantForm.rid = row.rid
    },
    // 更新用户状态
    changeState (id, type) {
      updataUserState(id, type)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '状态更新成功'
            })
            this.init()
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑用户
    edituser () {
      editUser(this.editForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success('用户编辑成功')
            this.init()
            this.editDialogTableVisible = false
            // 清空表单
            this.$refs.editForm.resetfields()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 编辑-默认展示用户数据
    showEditDialog (row) {
      this.editDialogTableVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 添加用户
    add () {
      // 提交的表单进行验证
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 如果验证通过,则调用添加用户的方法
          addUser(this.addForm)
            .then(res => {
              console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success('创建成功')
                this.init()
                this.addDialogFormVisible = false
                // 重置表单
                // this.$refs.addForm.resetfields()
                this.addForm = {}
              }
            })
            .catch(err => {
              console.log(err)
              // this.$message.success('添加用户失败')
            })
        } else {
          this.$message.error('数据输入不合法')
          return false
        }
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.userObj.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.userObj.pagenum = val
      this.init()
    },
    init () {
      getAllUsers(this.userObj)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 获取总记录数
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
            this.$router.push({ name: 'login' })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
    // 加载角色列表
    getAllRoleList()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>
<style lang="less">
</style>
