<template>
  <div>
    <div v-if="project.id" class="layout-nav">
      <div class="container-fluid">
        <div class="nav-control scrolling-tabs-container">
          <el-tabs class="nav-links" v-model="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="页面" name="doc"></el-tab-pane>
            <el-tab-pane label="成员" name="member"></el-tab-pane>
            <el-tab-pane v-if="project.role<=1" label="设置" name="setting"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="controls">
          <el-button type="primary" @click="newApi" icon="plus">添加页面</el-button>
        </div>
      </div>
    </div>
    <div class="content-wrapper page-with-layout-nav">
      <div class="container-fluid container-limited ">
        <!-- <div v-if="!project.id">
          <div class="blank-state">
            <div class="blank-state-icon">
              <i class="ifont icon-empty"></i>
              <span>你无权访问该项目信息</span>
            </div>
          </div>
        </div> -->
        <div class="content">
          <div v-if="activeName==='doc'">
            <c-doc :id="project.id"></c-doc>
          </div>
          <div v-if="activeName==='member'">
            <member :id="project.id"></member>
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
              <div class="panel-heading">删除项目</div>
              <div class="panel-body">
                <p>
                  删除项目是不可逆的，确认
                  <br>
                </p>
                <div class="form-actions">
                  <a class="btn btn-remove" rel="nofollow" @click="delectProject">删除项目</a>
                </div>
              </div>
            </div>
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
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import Member from './projects/members.vue'
  import CNew from './projects/CNew.vue'
  import CDoc from './projects/CDoc.vue'

  export default {
    mixins: [BasePage],
    components: {Member, CNew, CDoc},
    name: 'project',
    data: function () {
      return {
        content: '',
        project: {
          id: 1
        },
        activeName: 'doc'
      }
    },
    mounted: function () {
      // this.loadProject()
      console.log('hahhahah')
    },
    watch: {
    },
    methods: {
      loadProject: function () {
        Server({
          url: 'project/projectinfo',
          method: 'get',
          needLoading: true,
          params: {
            id: this.$route.query.id
          }
        }).then((response) => {
          this.project = response.data.data
        })
      },
      newApi: function () {
        this.openDialog({
          name: 'DAddPage',
          data: {
            title: '添加页面',
            form: {
              projectId: this.$route.query.id
            }
          },
          methods: {}
        })
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
      },
      /**
       * 删除当项目
       */
      delectProject: function () {
        this.$confirm('确认删除,删除后所有数据将清除', '提示', {
          type: 'warning'
        }).then(() => {
          Server({
            url: 'project/project',
            method: 'delete',
            data: {
              id: this.$route.query.id
            }
          }).then((response) => {
            this.$router.push({path: '/dashboard/projects'})
          }).catch(() => {
          })
        }).catch(() => {
          this.$message('已取消')
        })
      }
    }
  }
</script>
