<template>
  <header class="navbar navbar-fixed-top navbar-gitlab"
          :class="[{'header-collapsed':!theme.isOpen,'header-expanded':theme.isOpen,'header-pinned-nav':theme.isLock}]">
    <div class="container-fluid">
      <div class="header-content">
        <button @click.stop="toggle" aria-label="Toggle global navigation" class="side-nav-toggle" type="button">
          <span class="sr-only">Toggle navigation</span>
          <i class="ifont icon-menu"></i>
        </button>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="hidden-sm hidden-xs">
            
            </li>
          
            <li>
              <router-link title="New project" aria-label="New project" data-toggle="tooltip" data-placement="bottom"
                           data-container="body" to="/projects/new">
                <i class="el-icon-plus"></i>
              </router-link>
            </li>
            <li class="header-user dropdown">
              <el-popover
                  ref="user-tip"
                  placement="bottom"
                  width="260"
                  v-model="visibleUser">
                <div class="dropdown-menu-nav dropdown-menu-align-right">
                  <ul>
                    <li>
                      <router-link class="profile-link" aria-label="Profile" data-user="wangkm" to="/user">用户信息
                      </router-link>
                    </li>
                    <li>
                      <router-link aria-label="Profile Settings" to="/profile">用户设置</router-link>
                    </li>
                    <li class="divider"></li>
                    <li>
                      <a @click="logout" class="sign-out-link" aria-label="Sign out" rel="nofollow"
                         data-method="delete">退出登录</a>
                    </li>
                  </ul>
                </div>
              </el-popover>
              <a v-popover:user-tip class="header-user-dropdown-toggle" data-toggle="dropdown">
                <img width="26" height="26" class="header-user-avatar"
                     :src="userInfo.photo|defaultHeader">
                <span class="caret"></span>
              </a>
            </li>
          </ul>
        </div>
        <h1 class="title"><a href=""></a></h1>
        <router-link :to="{path:'/home'}" class="header-logo">
          <img src="../assets/image/logo.png" alt="logo">
        </router-link>
      </div>
    </div>
  </header>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .dropdown-menu-nav
    display block
    position relative
    border none

  .header-logo
    img
      width 105px
      height 40px

  .search
    margin-right: 10px;
    margin-left: 10px;
    margin-top: 7.5px;
</style>
<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import Server from '../extend/Server'
  import {mapState} from 'vuex'
  import Notify from 'title-notify'
  export default {
    mixins: [ BaseComponent ],
    name: 'Header',
    data: function () {
      return {
        visibleUser: false,
        input2: 1
      }
    },
    computed: mapState({
      theme: state => state.app.theme,
      packageInfo: state => state.app.packageInfo, // 项目信息
      userInfo: state => state.userInfo, // 用户信息
    }),
    mounted: function () {
      this.getMessageNum()
    },
    methods: {
      getMessageNum: function () {
      },
      notify: function (data) {
        if (!data) {
          return
        }
        if (window.localStorage.getItem('apimessnum') == data) {
          return
        }
        window.localStorage.setItem('apimessnum', data)
        var notify = new Notify({
          message: '有消息了。', // 标题
          effect: 'flash', //  flash | scroll 闪烁还是滚动
          openurl: '/dashboard/activity', //  点击弹窗打开连接地址
          onclick: function () { // 点击弹出的窗之行事件
            console.log('---')
          },
          // 标题闪烁，或者滚动速度
          interval: 1000,
          // 可选，默认绿底白字的  Favicon
          updateFavicon: {
            //  favicon 字体颜色
            textColor: '#fff',
            // 背景颜色，设置背景颜色透明，将值设置为“transparent”
            backgroundColor: '#1970a9'
          },
          // 可选chrome浏览器通知，默认不填写就是下面的内容
          notification: {
            title: 'goInterface 通知！', // 设置标题
            icon: '', // 设置图标 icon 默认为 Favicon
            body: '页面又改了'// 设置消息内容
          }
        })
        notify.setFavicon(data).notify({}).player()
      },
      toggle: function () {
        var isOpen = !this.theme.isOpen
        this.$store.dispatch('updataTheme', {
          isOpen: isOpen
        })
      },
      handleIconClick: function () {

      },
      /**
       * 登出
       */
      logout: function () {
        this.$confirm('确认登出系统', '提示', {
          type: 'warning'
        }).then(() => {
          Server({
            url: 'users/logout',
            method: 'post'
          }).then((response) => {
            this.ema.fire('logout')
          }).catch(() => {
            this.$message('登出失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      }
    }
  }
</script>

