<template>
  <div class="">
    <div class="panel panel-default" v-if="info.role<=1">
      <div class="panel-heading">
        添加用户到组
      </div>
      <div class="panel-body">
        <p class="light">
          该组的用户能访问该组的所有项目
        </p>
        <div class="new-group-member-holder">
          <el-form label-width="80px">

            <el-form-item label="账号">
              <el-select
                  class="searchUser"
                  v-model="req.userId"
                  multiple
                  filterable
                  remote
                  placeholder="请输入关键词"
                  :remote-method="querySearchAsync"
              >
                <el-option
                    v-for="item in searchUsers"
                    :key="item.id"
                    :label="item.name+item.email"
                    :value="item.id">
                </el-option>
              </el-select>

            </el-form-item>
            <el-form-item label="权限">
              <el-select v-model="req.role" placeholder="请选择">
                <el-option
                    v-for="(item,key) in Metadata.groupPower"
                    :key="key"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="(!req.role||!hasAddUser)" @click="onSubmit">添加用户到组</el-button>
            </el-form-item>

          </el-form>
        </div>
      </div>
    </div>

    <div class="panel panel-default">
      <div class="panel-heading">
        <strong>{{info.name}}</strong>
        组 存在用户
        <span class="badge">{{users.length}}</span>
        <div class="controls">

        </div>
      </div>
      <ul class="content-list">
        <li class="group_member js-toggle-container" :key="key" v-for="(item, key) in users">
          <div class="controls">
            <template v-if="canLeave||item.userId != userInfo.userId">
              <el-dropdown @command="handleCommand" v-if="info.role<=1">
                <span class="el-dropdown-link">
                  {{item.role | groupRole}} <i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :key="e.value" v-for="e in Metadata.groupPower" trigger="click"
                                    :command="e.value + ',' + item.userId">{{e.label}}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <template v-else>
                {{item.role | groupRole}}
              </template>
            </template>
            <template v-else>
              {{item.role | groupRole}}
            </template>
            <a v-if="(item.userId === userInfo.userId)&&canLeave" class="btn btn-remove"
               @click="remove(item,true)">离开</a>
            <a v-if="item.userId != userInfo.userId&&info.role<=1" class="btn btn-remove" @click="remove(item)">移除</a>
          </div>
          <span class="list-item-name">
            <img class="avatar s40" alt="" :src="item.photo|defaultHeader">
            <strong>
              <router-link :to="{path:'/user',query:{id:item.userId}}">{{item.name}}</router-link>
            </strong>
            <span class="label label-success" v-if="item.userId === userInfo.userId">当前用户</span>
            <div class="cgray">{{item.email}}</div>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .searchUser
    width 600px
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import UserItem from '../../components/User/Item'
  import {mapState} from 'vuex'
  import Vue from 'vue'
  Vue.component('my-item-zh', {
    functional: true,
    render: function (h, ctx) {
      return h('li', ctx.data, [ h(UserItem, {
        props: {
          item: ctx.props.item
        }
      }) ])
    },
    props: {
      item: { type: Object, required: true }
    }
  })
  export default{
    mixins: [ BasePage ],
    components: { UserItem },
    name: 'groups_members',
    props: { id: '' },
    data () {
      return {
        // 一个典型列表数据格式
        searchUsers: [],
        // 团队信息
        info: {},
        req: {
          groupId: '',
          role: '',
          userId: []
        },
        users: []
      }
    },
    computed: mapState({
      Metadata: state => state.Metadata,
      canLeave: function () {
        var num = 0
        this.users.forEach((value) => {
          console.log(value.userId, this.userInfo.userId)
          if (value.userId != this.userInfo.userId && value.role == 1) {
            num++
          }
        })
        return num > 0
      },
      hasAddUser: function () {
        if (this.req.userId.length > 0) {
          return true
        } else {
          return false
        }
      }
    }),
    mounted: function () {
      this.req.groupId = this.$route.query.id
      this.loadData()
    },
    methods: {
      querySearchAsync (queryString, cb) {
        if (queryString) {
          Server({
            url: 'users/search',
            method: 'get',
            params: { key: (queryString) }
          }).then((response) => {
            var results = this.pretreatmentList(response.data.data)
            this.searchUsers = results.filter((value) => {
              return value.id != this.userInfo.userId
            })
          }).catch(() => {

          })
        }
      },
      pretreatmentList (list) {
        var result = []
        list.forEach(function (e) {
          result.push({
            'value': e.name,
            'email': e.email,
            'name': e.name,
            'photo': e.photo,
            'id': e.id
          })
        })
        return result
      },
      loadData () {
        Server({
          url: 'project/groupuser',
          method: 'get',
          params: {
            count: 100,
            id: this.req.groupId,
            start: 0
          }
        }).then((response) => {
          this.users = response.data.data || []
        })
        Server({
          url: 'project/groupinfo',
          method: 'get',
          params: {
            id: this.info.id || this.req.groupId
          }
        }).then((response) => {
          this.info = response.data.data
        })
      },
      onSubmit () {
        this.req.groupId = this.req.groupId + ''
        Server({
          url: 'project/groupuser',
          method: 'post',
          data: this.req
        }).then((response) => {
          this.$message('添加成功')
          this.loadData()
        }).catch(() => {

        })
      },
      handleCommand (command) {
        var role = command.split(',')[ 0 ]
        var userId = command.split(',')[ 1 ]
        Server({
          url: 'project/groupuser',
          method: 'put',
          data: {
            groupId: this.req.groupId,
            role: role,
            userId: userId
          }
        }).then((response) => {
          this.$message('修改成功')
          this.loadData()
        }).catch(() => {

        })
      },
      remove (item, leave) {
        Server({
          url: 'project/groupuser',
          method: 'delete',
          data: {
            groupId: this.req.groupId + '',
            userId: item.userId
          }
        }).then((response) => {
          this.$message('删除成功')
          if (item.userId === this.userInfo.userId) {
            this.$router.push({ path: '/dashboard/groups' })
          } else {
            this.loadData()
          }
        }).catch(() => {

        })
      }
    }
  }
</script>
