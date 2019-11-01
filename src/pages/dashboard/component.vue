<template>
  <div class="content-wrapper">

    <div class="flash-container flash-container-page">
    </div>

    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="top-area">
          <el-tabs class="nav-links" :active-name="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="我的组件" name="my"></el-tab-pane>
          </el-tabs>
          <div class="nav-controls">

          </div>
        </div>
        <ul v-if="activeName==='my'" class="content-list">
          <li v-for="item in comLists" class="group-row" :key="item.id">
            <img class="avatar s40 hidden-xs" :src="item.path | componentIcon">
            <div class="title">
              {{item.name}}
            </div>
            <div class="description">
              <p>{{item.desc}}</p>
            </div>
            <div class="sourceButton">
              <el-button size="mini" type="primary" class="Button" v-if="userInfo.userId==item.userId" @click="goEditer(item)">编辑</el-button>
              <el-button size="mini" type="danger" class="Button" v-if="userInfo.userId==item.userId&&item.status==1" @click="delet(item,0)">禁用</el-button>
              <el-button size="mini" type="success" class="Button" v-if="userInfo.userId==item.userId&&item.status!=1" @click="delet(item,1)">启用</el-button>
            </div>
          </li>
          <div v-if="comLists.length==0">
            <div class="blank-state">
              <div class="blank-state-icon">
                <i class="ifont icon-empty"></i>
                <span>我还没有组件</span>
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .group-row {
    position: relative;

    .sourceButton {
      position: absolute;
      right: 0;
      top: 20px;
      bottom: 0;
      margin: auto;

      .Button {
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
    name: 'dashboard_groups',
    data () {
      return {
        activeName: 'my',
        // 一个典型列表数据格式
        comLists: []
      }
    },
    mounted: function () {
      this.loadData()
    },
    filters: {
      componentIcon: function (path) {
        return !path ? 'https://imagecdn.ymm56.com/ymmfile/explore-biz/ymm_1527843621175.png' : path.replace(/index.js$/, 'icon.png')
      }
    },
    methods: {
      // 删除
      delet: function (item, flag) {
        var me = this
        me.$confirm(`是否切换状态？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Server({
            url: 'component/delete',
            method: 'POST',
            needLoading: true,
            trimNull: false,
            data: {
              id: item.id,
              status: flag
            }
          }).then((res) => {
            this.loadData()
            me.$message({
              type: 'success',
              message: '切换成功!'
            })
          })
        }).catch(() => {})
      },
      /**
     * 点击编辑按钮前往编辑页面
     */
      goEditer (item) {
        this.$router.push({
          path: '/component/editer', query: {id: item.id}
        })
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
        if (tab.name == 'all') {
          this.loadData(0)
        } else if (tab.name == 'me') {
          this.loadData(1)
        }
      },
      loadData () {
        var keyword = this.searchKey || ''
        Server({
          url: 'component/searchAllStatusByName',
          method: 'post', // default
          needLoading: false,
          data: {
            onlyMine: 1,
            name: keyword
          }
        }).then(({data}) => {
          this.comLists = data.data && data.data.list || []
        })
      },
    }
  }
</script>
