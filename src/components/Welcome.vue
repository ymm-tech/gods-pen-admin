<template>
  <div class="welcome">
    <div class="emailActived" v-if="!isEmailActive">
      <div class="content">
        <i class="ifont icon-right"></i> 恭喜你注册成功，但是还需要在你的邮件里面去激活邮箱{{user.email}}，
        <hr>
        <el-button type="warning" @click="reactive">重新激活</el-button>
        <el-button type="" @click="loginOut">登出</el-button>
      </div>
    </div>
    <div class="el-loading-demo" v-if="loading">
      <div v-loading="true"></div>
      <div class="desc">{{loadingDesc}}</div>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .welcome {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #fff;

    .emailActived {
      width: 100%;
      background-color: #fff;
      color: #333;
      height: 100%;

      .content {
        margin: 100px auto;
        width: 50%;
      }

      .icon-right {
        color: green;
        font-size: 30px;
      }
    }
  }

  .el-loading-demo {
    position: absolute;
    top: 50%;
    width: 100px;
    left: 0;
    text-align: center;
    right: 0;
    margin: auto;

    .desc {
      margin-top: 20px;
    }
  }
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from '../extend/Server'
  export default {
    mixins: [BaseComponent],
    name: 'Welcome',
    data: function () {
      return {
        user: {},
        loading: true,
        loadingDesc: '初始化中---',
        isEmailActive: true
      }
    },
    mounted () {
      // 获取用户信息
      Server({
        url: 'users/info',
        params: {
          uid: 0
        },
        method: 'get'
      }).then((response) => {
        this.loading = false
        this.user = response.data.data
        // 初始化导航信息
        // 设置用户信息
        this.$store.dispatch('initUserInfo', this.user)
        if (this.user.emailStatus === 1) {
          this.isEmailActive = false
          return
        }
        this.initAllCategory()
      }).catch(() => {
        // this.$alert('获取用户信息失败')
        this.loading = false
      })
    },
    methods: {
      loginOut () {
        window.EMA.fire('logout')
      },
      initAllCategory: function () {
        Server({
          url: 'editor/category/list',
          method: 'POST',
          data: {}
        }).then((res) => {
          var data = res.data
          this.$store.dispatch('initAllCategory', data.data || [])
          this.$emit('loadend')
        })
      },
      reactive: function () {
        Server({
          url: 'users/sendActiveEmail',
          method: 'get'
        }).then((response) => {
          this.$message('发送成功，亲到邮箱中去激活')
        }).catch(() => {
          this.$message('发送失败')
        })
      }
    }
  }
</script>

