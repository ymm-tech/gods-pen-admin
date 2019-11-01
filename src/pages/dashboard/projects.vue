<template>
  <div class="content-wrapper">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited">
      <div class="content">
        <div class="top-area">
          <el-tabs class="nav-links" :active-name="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="我的参与的项目" name="me"></el-tab-pane>
            <!-- <el-tab-pane label="关注项目" name="star"></el-tab-pane>
         -->
          </el-tabs>
          <div class="nav-controls">
            <!--
            <div class="dropdown inline">
              <el-input
                  size="large"
                  placeholder="搜索"
                  v-model="searchText">
              </el-input>
            </div>-->

            <router-link class="btn btn-new" to="/projects/new">创建项目</router-link>
          </div>
        </div>

        <div class="projects-list-holder">
          <ul v-if="activeName==='me'" class="projects-list content-list">
            <div v-if="!hasMyData">
              <div class="blank-state">
                <div class="blank-state-icon">
                  <i class="ifont icon-empty"></i> <span>暂无项目</span>
                </div>
                <h3 class="blank-state-title">
                  <router-link :to="{path:'/projects/new'}">
                    <el-button type="primary">添加项目</el-button>
                  </router-link>
                </h3>
              </div>
            </div>

            <el-collapse v-model="activeNames" v-else>
              <el-collapse-item :title="group.name" :name="group.id" v-for="(group, index) in myProjects" :key="group.groupId">
                <router-link class="card" v-for="(item, index) in group.data" :key="item.id" :to="{path:'/project',query:{id:item.id}}" tag="div">
                  <div class="img">
                    <img :src="item.image|defaultProject" class="image">
                  </div>
                  <div class="cardContent">
                    <div class="title">
                      {{item.projectName}}
                    </div>
                    <div class="time">{{item.createTime | datetime}}</div>
                    <!-- <div class="desc">
                      {{item.desc}}
                    </div> -->
                  </div>
                </router-link>
              </el-collapse-item>
            </el-collapse>

          </ul>
          <ul v-if="activeName==='star'" class="projects-list content-list">
            <div v-if="!hasMyStarData">
              <div class="blank-state">
                <div class="blank-state-icon">
                  <i class="ifont icon-empty"></i> <span>暂无关注项目</span>
                </div>
              </div>
            </div>
            <router-link :to="{path:'/project',query:{id:item.id}}" tag="li" v-for="item in starProjects" :key="item.id" class="project-row">
              <div class="title">
                <div class="project">
                  <div class="dash-project-avatar">
                    <div class="avatar project-avatar s40 identicon">
                      <img class="avatar project-avatar s40" :src="item.logo">
                    </div>
                  </div>
                  <span class="project-full-name">
                    <router-link tag="span" :to="{path:'/user',query:{id:item.creatorId}}" class="namespace-name">
                      {{item.creatorName}}
                      /
                    </router-link>
                    <router-link tag="span" :to="{path:'/groups_index',query:{id:item.groupId}}" class="namespace-name">
                      {{item.groupName}}
                      /
                    </router-link>
                    <router-link tag="span" :to="{path:'/project',query:{id:item.id}}" class="project-name filter-title">
                      {{item.projectName}}
                    </router-link>
                  </span>
                </div>
              </div>
              <div class="description">
                <p>{{item.description}}</p>
              </div>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .project-name, .namespace-name {
    cursor: pointer;
  }
  .projects-list-holder .el-collapse-item >>> .el-collapse-item__wrap {
    border 0
    overflow auto
  }
  .content-wrapper .top-area {
    border 0
  } 
  .content-wrapper .content .projects-list-holder .el-collapse {
    border 0
  }
  .card {
    float: left;
    margin: 10px;
    width: 200px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    transition: transform 0.4s ease
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 0 rgba(0,0,0,.16);
      transform: translate3d(0,-2px,0);
    }
    .cardContent {
      .title {
        padding: 10px 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333;
        letter-spacing: 0;
        line-height: 18px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time {
        padding: 0 10px 8px 10px;
        font-family: PingFangSC-Light;
        font-size: 14px;
        color: #898c93;
        letter-spacing: 0;
        line-height: 14px;
      }
      .desc {
        padding: 5px 10px;
      }
    }

    .img {
      width 200px
      height 200px
      .image {
        width 200px
        height 200px
        z-index: 0;
        top: 0;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  export default {
    mixins: [BasePage],
    components: {},
    name: 'dashboard_projects',
    data () {
      return {
        searchText: '',
        activeName: 'me',
        activeNames: [],
        // 一个典型列表数据格式
        myProjects: {},
        starProjects: []
      }
    },
    mounted: function () {
      this.loadMyProject()
    },
    computed: {
      hasMyData: function () {
        return Object.keys(this.myProjects).length > 0
      },
      hasMyStarData: function () {
        return this.starProjects.length > 0
      }
    },
    methods: {
      tabHandleClick (tab) {
        this.activeName = tab.name
        if (tab.name == 'me') {
          this.loadMyProject()
        } else if (tab.name == 'star') {
          this.loadStarProject()
        }
      },
      loadMyProject: function () {
        Server({
          url: 'project/project',
          method: 'get',
          needLoading: true,
          params: {
            count: 100,
            start: 0
          }
        }).then((response) => {
          var data = response.data.data || []
          data.sort((a, b) => {
            return b.groupId - a.groupId
          })
          var myProjects = {}
          data.forEach(element => {
            if (!myProjects[element.groupId]) {
              this.activeNames.push(element.groupId)
              myProjects[element.groupId] = {id: element.groupId, name: element.groupName, data: []}
            }
            myProjects[element.groupId].data.push(element)
          })
          this.myProjects = myProjects
        }).catch(() => {

        })
      },
      loadStarProject: function () {
        Server({
          url: 'project/getmyfavorateproject',
          method: 'get',
          mock: true,
          data: {
            count: 100,
            start: 0
          }
        }).then((response) => {
          this.starProjects = response.data.data || []
        }).catch(() => {

        })
      },
      search () {
        this.loadData(this.tableInfo.pagination.curr)
      }
    }
  }
</script>
