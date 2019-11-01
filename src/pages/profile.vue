<template>
  <div>
    <div class="layout-nav">
      <div class="container-fluid">
        <div class="nav-control scrolling-tabs-container">
          <el-tabs class="nav-links" v-model="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="基本信息" name="base"></el-tab-pane>
            <!-- <el-tab-pane label="access" name="secretq" v-if='userInfo && !!userInfo.security'></el-tab-pane> -->
            <!-- <el-tab-pane label="消息订阅" name="active"></el-tab-pane>
            <el-tab-pane label="密码" name="password"></el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="content-wrapper page-with-layout-nav">
      <div class="container-fluid container-limited ">
        <div class="content">
          <!--基本信息-->
          <div v-show="activeName=='base'" class="row prepend-top-default">
            <div class="col-lg-3 profile-settings-sidebar">
              <h4 class="prepend-top-0">
                用户信息
              </h4>
            </div>
            <div class="col-lg-9">
              <el-form ref="baseForm" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="头 像">
                  <div class="headIcon">
                    <img :src="form.photo|defaultHeader">
                  </div>
                  <upload accept="image" :showBtn="true" :auto="true" @uploadSuccess="uploadEnd"></upload>
                </el-form-item>
                <el-form-item label="邮 箱" prop="email">
                  <el-input placeholder="邮箱" :disabled="!!userInfo.email" v-model="form.email">
                  </el-input>
                </el-form-item>
                <el-form-item label="姓 名" prop="name">
                  <el-input placeholder="姓名" v-model="form.name">
                  </el-input>
                </el-form-item>
                <el-form-item label="手 机" prop="telephone">
                  <el-input placeholder="手 机" v-model="form.telephone">
                  </el-input>
                </el-form-item>
                <el-form-item label="token" prop="security" :rules="[
                          { message: '输入1-35位token', trigger: 'blur'},
                          { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                          ]">
                  <el-input placeholder="token" :maxlength="64" v-model="form.security" disabled>
                    <el-button slot="append" @click="makeSecurity">随机生成</el-button>
                  </el-input>
                  <div class="desc">
                    <div>创建组件、命令行登录等场景需使用token</div>
                  </div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="baseSubmit">修改</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <!--密码修改-->
          <div v-show="activeName=='password'" class="row prepend-top-default">
            <div class="col-lg-3 profile-settings-sidebar">
              <h4 class="prepend-top-0">
                密码修改
              </h4>
            </div>
            <div class="col-lg-9">
              <el-form ref="passwordForm" :model="passform" :rules="rules" label-width="100px">
                <el-form-item label="老密码" prop="password">
                  <el-input type="password" placeholder="老密码" v-model="passform.password">
                  </el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="targetPassword">
                  <el-input type="password" placeholder="新密码" v-model="passform.targetPassword">
                  </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="targetPassword2">
                  <el-input type="password" placeholder="确认密码" v-model="passform.targetPassword2">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="passSubmit">确认修改</el-button>
                </el-form-item>

              </el-form>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .headIcon {
    width: 150px;
    height: 150px;
    // border-radius: 50%;
    border: 1px solid #eee;
    padding: 2px;
    overflow: hidden;
    margin: 20px;

    img {
      width: 100%;
      height: 100%;
    }
  }
  .desc{
    color: #E6A23C
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Upload from 'src/components/Upload'
  import Server from 'src/extend/Server'
  var SHA256 = require('crypto-js/sha256')
  var MD5 = require('crypto-js/md5')

  export default {
    mixins: [BasePage],
    components: {Upload},
    name: 'profile',
    data () {
      var targetPassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passform.targetPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      let validateCheck = (rule, value, callback) => {
        if (!/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.form.email)) {
          callback(new Error('请输入正确的邮箱地址'))
        } else {
          callback()
        }
      }
      return {
        activeName: 'base',
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'}
          ],
          account: [
            {required: true, message: '请输入账户名称', trigger: 'blur'},
            {min: 5, max: 20, message: '5-20位大小写字母和._-组成的名称', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱地址', trigger: 'blur'},
            {validator: validateCheck}
          ],
          telephone: [
            {min: 11, max: 11, message: '11位手机号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur'}
          ],
          targetPassword: [
            {required: true, message: '输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur'}
          ],
          targetPassword2: [
            {validator: targetPassword2, trigger: 'blur'}
          ]
        },
        passform: {
          password: '',
          targetPassword: '',
          targetPassword2: ''
        },
        // 一个典型列表数据格式
        form: {
          email: '',
          photo: '',
          name: '',
          telephone: '',
          security: ''
        }
      }
    },
    mounted: function () {
      this.form.name = this.userInfo.name
      this.form.telephone = this.userInfo.telephone
      this.form.email = this.userInfo.email
      this.form.photo = this.userInfo.photo || `https://s.gravatar.com/avatar/${MD5(this.userInfo.email)}`
      if (this.userInfo.security) {
        this.form.security = this.userInfo.security
      } else {
        this.makeSecurity()
        this.baseSubmit()
      }
    },
    methods: {
      makeSecurity () {
        var len = 64
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
        var maxPos = $chars.length
        var pwd = ''
        for (var i = 0; i < len; i++) {
          pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
        }
        this.form.security = pwd
      },
      uploadEnd: function (url) {
        this.form.photo = url
      },
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        console.log(file)
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
      },
      baseSubmit: function () {
        this.$refs.baseForm.validate((valid) => {
          if (valid) {
            Server({
              url: 'users/edit',
              data: this.form,
              method: 'put'
            }).then((response) => {
              this.$message('修改成功')
              this.$store.dispatch('initUserInfo', this.form)
            }).catch((e) => {
              this.$message('修改失败')
            })
          } else {
            return false
          }
        })
      },
      passSubmit: function () {
        this.$refs.passwordForm.validate((valid) => {
          if (valid) {
            Server({
              url: 'users/updatePassword',
              data: {
                password: SHA256(this.passform.password) + '',
                targetPassword: SHA256(this.passform.targetPassword) + ''
              },
              method: 'put'
            }).then((response) => {
              this.$message('修改成功')
              this.$refs.passwordForm.resetFields()
            }).catch((e) => {
              this.$message('修改失败')
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>
