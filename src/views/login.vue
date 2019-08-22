<template>
  <div class="login">
    <div class="container">
      <img src="../assets/avatar.jpg" alt class="avatar" />
      <el-form class="demo-ruleForm" :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input
            prefix-icon="myicon myicon-user"
            v-model="loginForm.username"
            placeholder="请输入账户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="myicon myicon-key"
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-btn" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { type } from 'os'
import { login } from '@/api/user_index.js'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '账户不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login () {
      // 表单的validate方法实现数据的验证,在验证完成的时候(失败或成功都是完成),会调用传入的回调函数,这个回调函数有一个参数valid,如果这个参数为true,则说明验证通过(可以继续登陆请求),否则验证失败(阻止登陆请求并给出提示)
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          console.log('可以发请求了')
          console.log(this.loginForm)
          // 验证成功
          login(this.loginForm)
            .then((res) => {
              if (res.data.meta.status === 200) {
                console.log(res)
                // 将token存储到本地
                localStorage.setItem('hm_manager_token', res.data.data.token)
                // 进行路由跳转
                this.$router.push({ name: 'home' })
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'warning'
                })
              }
            })
            // 验证失败
            .catch(() => {
              this.$message({
                message: '服务器异常，请稍后重试',
                type: 'error'
              })
            })
        } else {
          this.$message({
            message: '请输入所有必填数据',
            type: 'warning'
          })
          // 须要return false才能阻止请求
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
