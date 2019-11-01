<template>
  <div class="findPassword">
    <h2>重置密码</h2>
    <hr>
    <el-form ref="passwordForm" :model="form" :rules="passwordRule" label-width="70px" class="form">
      <el-form-item label="新密码" prop="password">
        <el-input placeholder="请输入新密码" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="password2">
        <el-input placeholder="确认密码" type="password" v-model="form.password2">
        </el-input>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="updatePassword">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
.findPassword
  padding 20px
  width: 600px;
  min-height: 330px;
  margin: 20px auto;
  background-color: #f5f5f5;
  border-radius: 8px;
  hr 
    display: block;
    height: 1px;
    border-top: 1px solid #ccc;
    margin: 1em 0;
    margin-bottom 50px
  .form
    width: 300px;
    margin-left: 140px;
    margin-top: 30px;
    padding-bottom: 20px;  
</style>

<script type="text/ecmascript-6">
  import Server from './extend/Server'
  var SHA256 = require('crypto-js/sha256')
  const config = require('src/config')

  export default{
    components: {},
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        form: {
          password: '',
          password2: ''
        },
        passwordRule: {
          password: [
            { required: true, message: '输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }
      }
    },
    mounted () {},
    methods: {
      updatePassword () {
        let code = window.location.search.match(/code=([^&]+)/) && window.location.search.match(/code=([^&]+)/)[1]
        Server({
          url: 'users/newUpdatePassword',
          data: {
            password: SHA256(this.form.password) + '',
            code
          },
          method: 'post'
        }).then((res) => {
          if (res.data.code == 1) {
            this.$alert('密码设置成功！', '').then(() => {
              window.location.replace(config.ADMIN_PATH + 'login.html')
            })
          }
        })
      }
    }
  }
</script>
