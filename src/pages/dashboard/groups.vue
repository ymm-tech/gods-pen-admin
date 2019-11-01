<template>
  <div class="content-wrapper">


    <div class="flash-container flash-container-page">
    </div>


    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="top-area">
          <el-tabs class="nav-links" :active-name="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="所有组" name="all"></el-tab-pane>
           <!-- <el-tab-pane label="我的组" name="me"></el-tab-pane>-->
          </el-tabs>
          <div class="nav-controls">
            <router-link class="btn btn-new" to="/groups/new">新建团队
            </router-link>
          </div>
        </div>
        <ul v-if="activeName==='all'" class="content-list">
          <li v-for="item in allGroup" class="group-row">
            <img class="avatar s40 hidden-xs"
                 :src="item.logo|defaultGroup">
            <div class="title">
              <router-link class="group-name" :to="{path:'/groups/index',query:{id:item.id}}">
                {{item.name}}
              </router-link>
              我是 <span>{{item.role | groupRole}}</span>
            </div>
            <div class="description">
              <p>{{item.description}}</p>
            </div>
          </li>
        </ul>
        <ul v-if="activeName==='me'" class="content-list">
          <li v-for="item in myGroup" class="group-row">
            <img class="avatar s40 hidden-xs"
                 :src="item.logo"
                 alt="">
            <div class="title">
              <router-link class="group-name" :to="{path:'/groups/members',query:{id:item.id}}">
                {{item.name}}
              </router-link>
              我是 <span>{{item.role | groupRole}}</span>
            </div>
            <div class="description">
              <p>{{item.description}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">

</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  export default{
    mixins: [ BasePage ],
    components: {},
    name: 'dashboard_groups',
    data () {
      return {
        activeName: 'all',
        // 一个典型列表数据格式
        allGroup: [],
        myGroup: []
      }
    },
    mounted: function () {
      this.loadData(0)
    },
    methods: {
      tabHandleClick (tab) {
        this.activeName = tab.name
        if (tab.name == 'all') {
          this.loadData(0)
        } else if (tab.name == 'me') {
          this.loadData(1)
        }
      },
      loadData (type) {
        Server({
          url: 'project/group',
          method: 'get',
          params: {
            count: 100,
            type: type,
            start: 0
          }
        }).then((response) => {
          if (type === 0) {
            this.allGroup = response.data.data
          } else if (type === 1) {
            this.myGroup = response.data.data
          }
        }).catch(() => {
        })
      },
      search () {
        this.loadData(this.tableInfo.pagination.curr)
      }
    }
  }
</script>
