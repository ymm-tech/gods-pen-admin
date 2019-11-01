<template>
  <div class="">


    <div class="flash-container flash-container-page">
    </div>


    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="project-members-page prepend-top-default">
          <div class="panel panel-default" v-if="role<=2">
            <div class="panel-heading">
              添加用户到项目
            </div>
            <div class="panel-body">
              <p class="light">
                下面列举的是可以访问项目的所有用户
              </p>
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
                        v-for="(item, key) in projectPower"
                        :key="key"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="(!req.role||!hasAddUser)" @click="onSubmit">添加用户到项目</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="panel panel-default">
            <div class="panel-heading">
              <strong>{{info.projectName}}</strong>
              <span class="badge">{{pusers.length}}</span>
            </div>
            <ul class="content-list">
              <li class="group_member js-toggle-container" :key="key" v-for="(item, key) in pusers">
                <div class="controls">
                  <el-dropdown @command="handleCommand" v-if="role<=2">
                      <span class="el-dropdown-link">
                      {{item.role|projectRole}}<i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item :key="e.value" v-for="e in projectPower" trigger="click"
                                        :command="e.value + ',' + item.userId">{{e.label}}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <template v-else>
                    {{item.role | groupRole}}
                  </template>

                  <a v-if="(item.userId === userInfo.userId)" class="btn btn-remove"
                     @click="remove(item,true)">离开</a>
                  <a v-if="item.userId != userInfo.userId&&info.role<=2" class="btn btn-remove"
                     @click="remove(item)">移除</a>

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


          <div class="panel panel-default">
            <div class="panel-heading">
              <strong>{{info.groupName}}</strong>
              <span class="badge">{{gusers.length}}</span>
            </div>
            <ul class="content-list">
              <li class="group_member js-toggle-container" :key="item.userId" v-for="(item, key) in gusers">
                <span class="list-item-name">
                  <img class="avatar s40" alt="" :src="item.photo|defaultHeader">
                  <strong>
                    <router-link :to="{path:'/user',query:{id:item.userId}}">{{item.name}}</router-link>
                  </strong>
                  <span class="label label-success" v-if="item.userId === userInfo.userId">当前用户</span>
                  <div class="cgray">{{item.email}}</div>
                  <div class="cgray">{{item.role|projectRole}}</div>
                </span>
              </li>
            </ul>
          </div>

        </div>

      </div>
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
    components: {},
    name: 'projects_members',
    props: {
      id: { // 项目id
        type: String
      }
    },
    data () {
      return {
        searchUsers: [],
        // 团队信息
        info: {},
        req: {
          projectId: '',
          role: '',
          userId: ''
        },
        value: '',
        pusers: [],
        gusers: []
      }
    },
    mounted: function () {
      this.req.projectId = this.id
      this.loadData()
    },
    computed: mapState({
      Metadata: state => state.Metadata,
      projectPower: function (state) {
        return state.Metadata.projectPower.filter((value) => {
          return value.value != 1
        })
      },
      hasAddUser: function () {
        if (this.req.userId.length > 0) {
          return true
        } else {
          return false
        }
      },
      role: function () {
        var role = 100
        this.pusers.forEach((value) => {
          if (value.userId == this.userInfo.userId) {
            role = Math.min(role, value.role)
          }
        })
        this.gusers.forEach((value) => {
          if (value.userId == this.userInfo.userId) {
            role = Math.min(role, value.role)
          }
        })
        return role
      },
      canLeave: function () {
        return true
      }
    }),
    methods: {
      querySearchAsync (queryString, cb) {
        if (queryString == '') {
          return
        }
        Server({
          url: 'users/search',
          method: 'get',
          params: { key: queryString }
        }).then((response) => {
          var results = this.pretreatmentList(response.data.data)
          this.searchUsers = results
        }).catch(() => {

        })
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
          url: 'project/projectuser',
          method: 'get',
          params: {
            count: 100,
            projectId: this.req.projectId,
            start: 0
          }
        }).then((response) => {
          this.pusers = response.data.data
        })
        Server({
          url: 'project/projectinfo',
          method: 'get',
          params: {
            id: this.req.projectId
          }
        }).then((response) => {
          this.info = response.data.data
          var me = this
          Server({
            url: 'project/groupuser',
            method: 'get',
            params: {
              count: 100,
              id: this.info.groupId,
              start: 0
            }
          }).then((response) => {
            me.gusers = response.data.data
          })
        })
      },
      handleCommand (command) {
        var role = command.split(',')[ 0 ]
        var userId = command.split(',')[ 1 ]
        Server({
          url: 'project/projectuser',
          method: 'put',
          data: {
            projectId: this.req.projectId,
            role: role,
            userId: userId
          }
        }).then((response) => {
          this.$message('修改成功')
          this.loadData()
        }).catch(() => {

        })
      },
      onSubmit: function () {
        Server({
          url: 'project/projectuser',
          method: 'post',
          data: this.req
        }).then((response) => {
          this.$message('添加成功')
          this.loadData()
        }).catch(() => {

        })
      },
      remove (item) {
        Server({
          url: 'project/projectuser',
          method: 'delete',
          data: {
            projectId: this.req.projectId,
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
