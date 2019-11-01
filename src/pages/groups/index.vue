<template>
  <div class="content-wrapper page-with-layout-nav">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="top-area">
          <el-tabs class="nav-links" :active-name="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="信 息" name="info"></el-tab-pane>
            <el-tab-pane v-if="info.id" label="成 员" name="member"></el-tab-pane>
            <el-tab-pane v-if="info.id" label="项 目" name="project"></el-tab-pane>
            <el-tab-pane label="统计" name="report"></el-tab-pane>
            <el-tab-pane v-if="info.id&&info.role<=1" label="设 置" name="setting"></el-tab-pane>
          </el-tabs>
        </div>
        <div v-if="activeName=='info'" class="group-members-page prepend-top-default">
          <div class="panel panel-default prepend-top-default">
            <div class="panel-heading">
              基本信息
            </div>
            <div class="panel-body">
              <div v-if="!info.id">
                <div class="blank-state">
                  <div class="blank-state-icon">
                    <i class="ifont icon-empty"></i> <span>你无权访问该组信息</span>
                  </div>
                </div>
              </div>
              <el-form v-else ref="form" :model="info" label-width="80px">
                <el-form-item label="图标">
                  <div class="headIcon">
                    <img :src="info.logo|defaultGroup">
                  </div>
                </el-form-item>

                <el-form-item label="名称"
                              prop="name"
                >
                  <el-input placeholder="名称" :disabled="true" v-model="info.name">
                  </el-input>
                </el-form-item>
                <el-form-item label="描述"
                              prop="description"
                >
                  <el-input :disabled="true" type="textarea" v-model="info.description"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-alert class="tipWarp"
                    title="项目组描述"
                    type="info">
            <div v-html="groupMd"></div>
          </el-alert>
        </div>
        <div v-if="activeName=='member'" class="group-members-page prepend-top-default">
          <members v-if="info.id" :id="info.id"></members>
        </div>
        <div class="report" v-if="activeName==='report'">
          <report :group-id='groupId'></report>
        </div>
        <div v-if="activeName=='project'" class="projects-list-holder">

          <div v-if="!hasData">
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
          <ul v-else class="projects-list content-list">
            <router-link :to="{path:'/project',query:{id:item.id}}" tag="li"
                         v-for="item in projects" :key="item.id" class="project-row">
              <div class="title">
                <div class="project">
                  <div class="dash-project-avatar">
                    <div class="avatar project-avatar s40 identicon">
                      <img class="avatar project-avatar s40" :src="item.logo|defaultProject">
                    </div>
                  </div>
                  <span class="project-full-name">
                    <router-link tag="span" :to="{path:'/user',query:{id:item.creatorId}}" class="namespace-name">
                    {{item.creatorName}}
                    /
                    </router-link>
                    <router-link tag="span" :to="{path:'/project',query:{id:item.id}}"
                                 class="project-name filter-title">
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
        <div v-if="activeName=='setting'">
          <div class="panel panel-default prepend-top-default">
            <div class="panel-heading">
              基本设置
            </div>
            <div class="panel-body">
              <c-new :on-success="addGroupSuccess" :id="info.id"></c-new>
            </div>
          </div>
          <div class="panel panel-danger">
            <div class="panel-heading">删除团队</div>
            <div class="panel-body">
              <p>
                删除团队会导致该团队的项目全部被删除
                <br>
                <strong>移除团队后不能回退，确定移除团队</strong>
              </p>
              <div class="form-actions">
                <a class="btn btn-remove" rel="nofollow" @click="remove">移除团队</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import Members from './members.vue'
  import CNew from './CNew.vue'
  import Report from './data.vue'
  var groupMd = require('src/assets/tip/help/group.md')

  export default{
    mixins: [ BasePage ],
    components: {Members, CNew, Report},
    name: 'groups_index',
    data () {
      return {
        // 一个典型列表数据格式
        info: {},
        projects: [],
        activeName: 'info',
        groupId: this.$route.query.id,
        groupMd: groupMd
      }
    },
    mounted: function () {
      this.getDetail()
    },
    watch: {
    },
    computed: {
      hasData: function () {
        return this.projects.length > 0
      }
    },
    methods: {
      addGroupSuccess: function (data) {
        if (data) {
          this.$router.push({ path: '/dashboard/groups' })
        }
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
        if (tab.name == 'project') {
          this.getProjects()
        }
      },
      getProjects () {
        Server({
          url: 'project/groupproject',
          method: 'get',
          params: {
            count: 100,
            groupId: this.$route.query.id,
            start: 0
          }
        }).then((response) => {
          this.projects = response.data.data
        }).catch(() => {
        })
      },
      getDetail (call) {
        Server({
          url: 'project/groupinfo',
          method: 'get',
          params: {
            id: this.$route.query.id
          }
        }).then((response) => {
          this.info = response.data.data
          call()
        }).catch(() => {}
        )
      },
      remove () {
        this.$confirm('此操作将永久删除该团队和团队下面的项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Server({
            url: 'project/group',
            method: 'delete',
            data: {
              id: this.$route.query.id - 0
            }
          }).then(() => {
            this.$message('删除成功')
            this.$router.push({ path: '/dashboard/groups' })
          }).catch(() => {
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>
