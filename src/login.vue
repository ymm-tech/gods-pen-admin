<template>
  <div class="custom-page-class">
    <div class="main">
      <div class="switch-nav" @click="handleClick">
        {{activeName == 'login' ? '注册 →' : '登录 →'}}
      </div>
      <a href="https://godspen.ymm56.com/" target="_blank">
        <img src="./assets/image/logo.png" alt="logo" class="logo">
      </a>
      <div class="name">
        <a target="_blank" href="https://github.com/ymm-tech/gods-pen" class="github-btn">
          <span class="gh-btn github">
            <span class="gh-icon"></span>
            <span class="gh-text">Star</span>
          </span>
          <span class="gh-count github">{{githubCount}}</span>
        </a>
      </div>
      <div class="form-box">
        <el-form ref="loginForm" :model="loginForm" :rules="registerrule" v-if="activeName == 'login'">
          <el-form-item label="" prop="account">
            <el-input placeholder="邮箱" type="text" auto-complete="on" id="username" name="username"
                      v-model="loginForm.account">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="密 码" type="password" auto-complete="on" v-model="loginForm.password">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="kaptcha">
            <el-input placeholder="验证码" style="width:120px" v-model="loginForm.kaptcha">
            </el-input>
            <img @click="changeKaptcha" :src="kaptchaImg" class="kaptchaImg">
          </el-form-item>
          <div class="submit-box">
            <el-button class="submit-box__btn" type="primary" :loading="loading" @click="loginSubmit">登 陆</el-button>
            <div class="forget">
              <div class="oauth-wrap" style="float:left;" v-if='enableGithub'>
                <div class='oauth-channel'>
                  <el-tooltip class="item" effect="dark" content="GitHub登录" placement="top">
                    <img class='oauth' src="https://b-gold-cdn.xitu.io/v3/static/img/github.547dd8a.svg" alt="" @click='oauthGitHub("github")'>
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div style="float:right; cursor: pointer;" @click="forgetPassword">忘记密码？</div>
          </div>
        </el-form>
        <el-form ref="registerForm" :model="registerForm" :rules="registerrule" v-else>
          <el-form-item label="" prop="email">
            <el-input placeholder="邮箱" @blur="emailBlur" v-model="registerForm.email">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input placeholder="姓 名" v-model="registerForm.name">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="密 码" type="password" v-model="registerForm.password">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="password2">
            <el-input placeholder="确认密码" type="password" v-model="registerForm.password2">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="kaptcha">
            <el-input placeholder="验证码" style="width:120px" v-model="registerForm.kaptcha">
            </el-input>
            <img @click="changeKaptcha" :src="kaptchaImg" class="kaptchaImg">
          </el-form-item>
          <div class="submit-box">
            <el-button class="submit-box__btn" type="primary" :loading="loading" @click="registerSubmit">注 册</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div class="slogan">
        <img src="./assets/image/logo.png" alt="logo" class="slogan-logo">
        <span>码良&nbsp;&nbsp;&nbsp;&nbsp;高扩展的在线网页制作平台</span>
      </div>
      <div class="links">
        <a href="https://godspen.ymm56.com/doc/cookbook/introduce.html#%E7%A0%81%E8%89%AF%E6%98%AF%E4%BB%80%E4%B9%88" target="_blank">关于码良</a>
        <a href="https://godspen.ymm56.com/doc/cookbook/introduce.html" target="_blank">使用帮助</a>
      </div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
.custom-page-class {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
  width: 100%;
  height: 100%;
  background-color #fafafa;
  padding-top: 90px;
  .main {
    width: 400px;
    margin: 0 auto;
    background-color #fff;
    border: 1px solid #e9e9e9;
    border-radius 4px;
    padding: 40px 50px 48px;
    text-align center
    .logo {
      width 50%;
    }
    .switch-nav {
      color #409EFF
      cursor pointer
      text-align left
      font-size 18px;
      margin-bottom 10px;
    }
    .name {
      margin: 8px 0;
      font-size 18px;
      color #262626;
      .github-btn {
        margin-left 20px
        display: inline-block;
        vertical-align: middle;
        font: 700 11px/14px Helvetica Neue,Helvetica,Arial,sans-serif;
        .github {
          padding: 2px 5px 2px 4px;
          color: #333;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          border-radius: 3px;
          border: 1px solid #d5d5d5;
        }
        .gh-btn {
          background-color #eee
          float left
          .gh-icon {
            float left
            width: 14px;
            height: 14px;
            margin-right: 4px;
            background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgdmlld0JveD0iMTIgMTIgNDAgNDAiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMTIgMTIgNDAgNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiAxMy40Yy0xMC41IDAtMTkgOC41LTE5IDE5YzAgOC40IDUuNSAxNS41IDEzIDE4YzEgMC4yIDEuMy0wLjQgMS4zLTAuOWMwLTAuNSAwLTEuNyAwLTMuMiBjLTUuMyAxLjEtNi40LTIuNi02LjQtMi42QzIwIDQxLjYgMTguOCA0MSAxOC44IDQxYy0xLjctMS4yIDAuMS0xLjEgMC4xLTEuMWMxLjkgMC4xIDIuOSAyIDIuOSAyYzEuNyAyLjkgNC41IDIuMSA1LjUgMS42IGMwLjItMS4yIDAuNy0yLjEgMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEgMC43LTMuNyAyLTUuMWMtMC4yLTAuNS0wLjgtMi40IDAuMi01YzAgMCAxLjYtMC41IDUuMiAyIGMxLjUtMC40IDMuMS0wLjcgNC44LTAuN2MxLjYgMCAzLjMgMC4yIDQuNyAwLjdjMy42LTIuNCA1LjItMiA1LjItMmMxIDIuNiAwLjQgNC42IDAuMiA1YzEuMiAxLjMgMiAzIDIgNS4xYzAgNy4zLTQuNSA4LjktOC43IDkuNCBjMC43IDAuNiAxLjMgMS43IDEuMyAzLjVjMCAyLjYgMCA0LjYgMCA1LjJjMCAwLjUgMC40IDEuMSAxLjMgMC45YzcuNS0yLjYgMTMtOS43IDEzLTE4LjFDNTEgMjEuOSA0Mi41IDEzLjQgMzIgMTMuNHoiLz48L3N2Zz4=")
            background-size: 100% 100%;
            background-repeat: no-repeat;
          }
        }
        .gh-count {
          float left
          position: relative;
          margin-left: 4px;
          background-color: #fafafa;
        }
        .gh-count:before {    
          left: -4px!important;
          border-right-color: #d4d4d4!important;
          top: 50%;
          margin-top: -4px;
          border-width: 4px 4px 4px 0;
        }
        .gh-count:after {
          top: 50%;
          left: -4px;
          z-index: -1;
          margin-top: -5px;
          border-width: 5px 5px 5px 0;
          border-right-color: #d4d4d4;
        }
        .gh-count:after, .gh-count:before {
          content: "";
          position: absolute;
          display: inline-block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          box-sizing: border-box;
        }
      } 
    }
    .form-box {
      margin: 20px 0;
      text-align left
      .kaptchaImg {
        width: 80px;
        margin-left 5px
        background: #eee;
        cursor pointer
      }
      .submit-box {
        &__btn {
          width 100%
        }
        .forget {
          padding 10px 0
          text-align right
          color #409EFF
          cursor pointer
        }
      }
    }
    .oauth-wrap {
      display: flex;
      align-items: center;
      justify-content space-between
      margin-top: 4px;
      .oauth{
        margin-right 10px
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #f4f8fb;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor pointer
        img{
          width 80%
        }
      }
      
    }
  }
  .footer {
    width 450px
    margin: 80px auto;
    text-align center
    line-height: 22px;
    font-size: 14px;
    .slogan {
      padding: 6px 0;
      .slogan-logo {
        width 60px
        margin-right 3px
      }
    }
    .links {
      padding: 6px 0 16px;
      border-top: 1px solid #e8e8e8;
      a {
        display inline-block
        padding: 0 8px;
        color: #8c8c8c;
        &:hover {
          color #595959
          text-decoration none
        }
      }
    }
  }
}
</style>
<script>
  import {contentPart, footerPart} from './assets/js/metadata'
  import Server from './extend/Server'
  import config from './config'
  var SHA256 = require('crypto-js/sha256')

  export default {
    computed: {},
    data () {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        githubCount: '',
        contentPart: contentPart,
        footerPart: footerPart,
        loading: false,
        registerrule: {
          kaptcha: [
            { required: true, message: '输入4位验证码', trigger: 'blur' },
            { min: 4, max: 4, message: '输入4位验证码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '输入用户名', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '输入密码', trigger: 'blur' },
            { min: 6, max: 20, message: '6-20位大小写字母和._-组成的名称', trigger: 'blur' }
          ],
          password2: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ]
        },
        kaptchaImg: '',
        loginForm: {
          account: '',
          password: '',
          kaptcha: '',
          remember: true
        },
        registerForm: {
          email: '',
          kaptcha: '',
          name: '',
          password: '',
          password2: ''
        },
        activeName: 'login',
        enableGithub: config.enableGithub
      }
    },
    mounted () {
      window.fetch('https://api.github.com/repos/ymm-tech/gods-pen').then(data => {
        return data.json()
      }).then(res => {
        this.githubCount = res.stargazers_count
      })
      window.EMA.bind('logout', () => {
        this.logout()
      })
      window.EMA.bind('loading.show', () => {
        this.showLoading = true
      })
      window.EMA.bind('loading.hide', () => {
        this.showLoading = false
      })
      window.EMA.bind('alert.show', (title, fn) => {
        this.$alert(title, '注意', {
          callback: action => {
            if (typeof fn == 'function') {
              fn()
            }
          }
        })
      })
      let code = window.location.search.match(/code=([^&]+)/) && window.location.search.match(/code=([^&]+)/)[1]
      let channel = window.location.search.match(/from=([^&]+)/) && window.location.search.match(/from=([^&]+)/)[1]
      if (code) {
        this.dealOauth(code, channel)
      }
      // this.checkLogin()
      this.changeKaptcha()
      var user = window.localStorage.getItem('loginuser') || '{}'
      var userInfo = {}
      try {
        userInfo = JSON.parse(user)
      } catch (e) {
        userInfo = {}
      }
      this.loginForm.account = userInfo.account
      this.loginForm.password = userInfo.password
    },
    methods: {
      oauthGitHub (channel) {
        Server({
          url: `users/oauthCode`,
          needLoading: true,
          data: {
            channel: channel
          },
          method: 'post'
        }).then(({data}) => {
          data.data && window.location.replace(data.data.redirect)
        })
      },
      dealOauth (code, channel) {
        Server({
          url: 'users/oauthLogin',
          data: {
            code: code,
            channel: channel
          },
          needLoading: true,
          method: 'post'
        }).then((response) => {
          this.loginSuccess()
        }).catch((e) => {
          this.loading = false
          console.log('err', e)
        })
      },
      forgetPassword () {
        let self = this
        if (!this.loginForm.account) {
          this.$alert('请输入账号')
          return
        }
        this.$confirm('确认忘记密码！请前往邮箱通过点击链接重置密码！', '忘记密码', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.sendEmail()
        }).catch(() => {})
      },
      sendEmail () {
        Server({
          url: 'users/sendEmail',
          data: {
            email: this.loginForm.account
          },
          method: 'post'
        }).then((res) => {
        })
      },
      checkLogin: function () {
        Server({
          url: 'users/info',
          params: {
            uid: 0
          },
          method: 'get'
        }).then((response) => {
          this.loginSuccess()
        }).catch(() => {
        })
      },
      changeKaptcha: function () {
        Server({
          url: 'kaptcha/init',
          method: 'get'
        }).then((response) => {
          var data = response.data.data
          this.kaptchaImg = 'data:image/jpg;base64,' + data.img
        }).catch((e) => {
          this.loading = false
          console.log('err', e)
        })
      },
      parseURL: function (url) {
        var a = document.createElement('a')
        a.href = url
        return {
          params: (function () {
            var ret = {}
            var seg = a.search.replace(/^\?/, '').split('&')
            var len = seg.length
            var i = 0
            var s = null
            for (; i < len; i++) {
              if (!seg[ i ]) {
                continue
              }
              s = seg[ i ].split('=')
              ret[ s[ 0 ] ] = s[ 1 ]
            }
            return ret
          })()
        }
      },
      editPassword: function () {
      },
      handleClick: function () {
        this.activeName = this.activeName == 'login' ? 'register' : 'login'
        this.resetForm()
        this.changeKaptcha()
      },
      loginSuccess: function (data) {
        this.loading = false
        // 重定向到退出登陆的页面地址
        // 记录登陆信息。可以是cookie 也可以是 session
        var info = this.parseURL(window.location.href)
        if (info.params.url) {
          window.location.replace(decodeURIComponent(info.params.url))
        } else {
          window.location.replace('index.html')
        }
      },
      loginSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'users/login',
              data: {
                account: this.loginForm.account,
                kaptcha: this.loginForm.kaptcha,
                password: SHA256(this.loginForm.password) + ''
              },
              needLoading: true,
              method: 'post'
            }).then((response) => {
              window.localStorage.setItem('loginuser', JSON.stringify({
                account: this.loginForm.account,
                password: this.loginForm.password
              }))
              this.loginSuccess(response.data)
              console.log('sucee')
            }).catch((e) => {
              this.loading = false
              console.log('err', e)
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
        return false
      },
      emailBlur: function () {
        var name = this.registerForm.email.split('@')
        this.registerForm.name = name[ 0 ]
      },
      /**
       * 注册内容提交
       */
      registerSubmit: function () {
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            this.loading = true
            Server({
              url: 'users/register',
              data: {
                email: this.registerForm.email,
                kaptcha: this.registerForm.kaptcha,
                name: this.registerForm.name,
                password: SHA256(this.registerForm.password) + ''
              },
              method: 'post'
            }).then((response) => {
              this.loginSuccess()
            }).catch((e) => {
              this.loading = false
              console.log('err', e)
            })
          } else {
            return false
          }
        })
      },
      resetForm () {
        let form = this.activeName == 'login' ? 'registerForm' : 'loginForm'
        this.$refs[form].resetFields()
      }
    }
  }
</script>
