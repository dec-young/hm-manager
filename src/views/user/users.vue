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
      <el-button type="success" style="margin-left: 10px;" plain>添加用户</el-button>
    </div>
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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
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
import { getAllUsers } from '@/api/user_index.js'
export default {
  data () {
    return {
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
    // handleEdit (index, row) {
    //   console.log(index, row)
    // },
    // handleDelete (index, row) {
    //   console.log(index, row)
    // }
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
  }
}
</script>
<style lang="less">
</style>
