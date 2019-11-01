<template>
  <div>
    <div v-if="project.id" class="layout-nav">
      <div class="container-fluid">
        <div class="nav-control scrolling-tabs-container">
          <el-tabs class="nav-links" v-model="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="数据报表" name="datapanel"></el-tab-pane>
            <el-tab-pane v-if="project.role<4" label="设置" name="setting"></el-tab-pane>
            <el-tab-pane  label="操作历史" v-if="project.role<4" name="history"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="controls">
          <el-button type="primary" @click="goPageList">页面列表</el-button>
        </div>
      </div>
    </div>
    <div class="content-wrapper page-with-layout-nav">
      <div class="container-fluid container-limited ">
        <div v-if="!project.id">
          <div class="blank-state">
            <div class="blank-state-icon">
              <i class="ifont icon-empty"></i>
              <span>你无权访问该项目信息</span>
            </div>
          </div>
        </div>
        <div v-else class="content">
          <div v-if="activeName==='doc'">
            <c-doc :id="project.id"></c-doc>
          </div>
          <div v-if="activeName==='datapanel'">
            <data-panel :page-key="project.key" :id="project.id"></data-panel>
          </div>
          <div class="apis" v-if="activeName==='apis'">
            <c-interface :id="project.id"></c-interface>
          </div>
          <div v-if="activeName==='setting'">
            <div class="panel panel-default prepend-top-default">
              <div class="panel-heading">
                基本设置
              </div>
              <div class="panel-body">
                <c-new :id="project.id-0"></c-new>
              </div>
            </div>
            <div class="panel panel-danger">
              <div class="panel-heading">删除页面</div>
              <div class="panel-body">
                <p>
                  删除页面是不可逆的，确认
                  <br>
                </p>
                <div class="form-actions">
                  <a class="btn btn-remove" rel="nofollow" @click="delectProject">删除页面</a>
                </div>
              </div>
            </div>
          </div>
          <div  v-if="activeName==='history'" class="historyPannel">
            <history :type='project.type' :project-id='project.projectId' :id="project.id" :pageKey="project.key"></history>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .url {
    width: 400px;
  }

  .nav-control {
    float: left;
  }

  .project-tag {
    margin: 20px auto;
    padding: 10px;
    border: 1px dashed #ddd;
  }

  .apis {
    margin: 10px 0;
  }

  .content-wrapper {
    .apiItem {
      .header {
        position: relative;
        width: 90%;
        display: inline-block;

        .type {
          font-size: 18px;
          font-weight: bold;
          display: inline-block;
          width: 30px;
        }

        .path {
          margin-left: 20px;
        }

        .version {
          background-color: #5ac74b;
          color: #fff;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .controls {
          position: absolute;
          right: 1px;
          top: 0;
        }
      }
    }
  }
  .historyPannel{
    padding-top 20px
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import DataPanel from './pages/data.vue'
  import CNew from './pages/CNew.vue'
  import CDoc from './pages/CDoc.vue'
  import History from './pages/history.vue'

  export default {
    mixins: [BasePage],
    components: {DataPanel, CNew, CDoc, History},
    name: 'project',
    data: function () {
      return {
        content: ``,
        id: '',
        pageId: '',
        project: {},
        activeName: 'datapanel'
      }
    },
    async mounted () {
      var pageId = this.$route.query.key
      var id = this.$route.query.id
      if (pageId && pageId.length > 1) {
        this.pageId = pageId
        this.id = await this.getIdByKey(pageId) || id
      } else {
        this.id = id
      }
      this.loadProject()
    },
    watch: {
    },
    methods: {
      loadProject: function () {
        Server({
          url: 'editor/pages/info',
          method: 'post',
          needLoading: true,
          data: {
            id: this.id + ''
          }
        }).then((response) => {
          var data = response.data.data
          data.id = data.id + ''
          this.project = data
        })
      },
      newApi: function () {
        this.openDialog({
          name: 'DAddPage',
          data: {
            title: '添加页面',
            form: {
              projectId: this.id
            }
          },
          methods: {}
        })
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
      },
      goPageList: function () {
        this.$router.push({path: '/project', query: {id: this.project.projectId}})
      },
      /**
       * 删除当项目
       */
      delectProject: function () {
        var me = this
        this.$confirm('确认删除,删除后所有数据将清除', '提示', {
          type: 'warning'
        }).then(() => {
          Server({
            url: 'editor/pages/delete',
            method: 'POST',
            needLoading: true,
            trimNull: false,
            data: {
              id: this.id - 0
            }
          }).then((response) => {
            me.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.push({path: '/project', query: {id: this.project.projectId}})
          }).catch(() => {
          })
        }).catch(() => {
          this.$message('已取消')
        })
      },
      async getIdByKey (id) {
        let names = await Server({
          url: 'editor/pages/getNameBykeys',
          method: 'post',
          data: {
            ids: [id],
          }
        }).then(({data}) => {
          return data && data.data && data.data.names
        })
        return names && names[0] && names[0].id
      }
    }
  }
</script>
