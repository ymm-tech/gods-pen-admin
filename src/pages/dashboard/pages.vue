<template>
  <div class="content-wrapper">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="top-area">
          <el-tabs class="nav-links" :active-name="activeName" @tab-click="tabHandleClick">
            <el-tab-pane label="公共页面" name="public"></el-tab-pane>
            <!-- <el-tab-pane label="公共页面" name="star"></el-tab-pane> -->
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
          </div>
        </div>

        <div class="projects-list-holder">
          <ul v-if="activeName==='public'" class="projects-list content-list">
            <div v-if="publicPage.length==0">
              <div class="blank-state">
                <div class="blank-state-icon">
                  <i class="ifont icon-empty"></i>
                  <span>暂无公共页面</span>
                </div>
                <!-- <h3 class="blank-state-title">
                  <router-link :to="{path:'/projects/new'}">
                    <el-button type="primary">添加项目</el-button>
                  </router-link>
                </h3> -->
              </div>
            </div>
            <div class="pages clearfix">
              <div class="boxSize" v-for="(item,k) in publicPage" :key='k'>
                <div class="sourceName">{{item.name}}</div>
                <div class="sourceKey" v-show='0'>{{$route.query.key+'/'+item.key}}</div>
                <div class="sourceImg">
                  <img :src="item.image||'https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm1562307855048.png'" alt="">
                </div>
                <a :title="item.desc" style="display: inline-block; cursor: pointer;" :href="getUrl(item,true)" target="_blank">
                  <img class="qrcode" :src="getqrUrl(item)" alt="">
                </a>
                <div class="sourceButton">
                  <a class="editButton" @click='setting(item)'>设置</a>
                  <a class="editButton" :href="getUrl(item)" target="_blank">编辑</a>
                  <div class="editButton" @click="delet(item)" v-show="item.status==1" style="background-color: #f56c6c">删除
                  </div>
                  <div class="editButton" v-if="item.status == 1" @click="changeStatus(item)" style="background-color: #4A4C5B">
                    禁用
                  </div>
                  <div class="editButton" v-if="item.status == 2" @click="changeStatus(item)" style="background-color: #86C23A">
                    启用
                  </div>
                </div>
              </div>
            </div>
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

  .card {
    float: left;
    margin: 20px;
    width: 260px;
    height: 130px;
    border: 1px solid #dddddd;
    border-radius: 5px;
    overflow: hidden;
    position: relative;

    .cardContent {
      z-index: 2;
      position: absolute;
      width: 100%;
      height: 100%;

      .title {
        padding: 5px 10px;
        font-size: 16px;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.46);
      }

      .desc {
        padding: 5px 10px;
      }

      .bottom {
        width: 100%;
        position: absolute;
        bottom: 0;
        text-align: right;

        .buttons {
          float: right;
        }
      }
    }

    .image {
      z-index: 0;
      width: 100%;
      bottom: 0;
      position: absolute;
    }
  }

  .boxSize {
    position: relative;
    float: left;
    text-align: center;
    background-color: white;
    width: 200px;
    min-height: 240px;
    margin: 30px 1em 30px;
    box-shadow: 0px 0px 8px #8D8E8F;
    overflow: hidden;
    border-radius: 5px;

    .sourceName {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      font-weight: bolder;
      font-size: 16px;
      color: #666;
      height: 28px;
      line-height: 28px;
      position: absolute;
      background-color: rgba(224, 142, 11, 0.45);
    }

    .sourceKey {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      // font-weight: 600;
      font-size: 14px;
      height: 28px;
      line-height: 28px;
      color: #ffffff;
      position: absolute;
      top: 28px;
      background-color: rgba(119, 119, 119, 0.7);
    }

    &:hover {
      .sourceButton {
        display: block;
      }

      .qrcode {
        display: block;
      }
    }

    .sourceImg {
      width: 100%;
      height: 300px;
      overflow: hidden;

      img {
        width: 100%;
        border-radius: 4px;
      }
    }

    .qrcode {
      width: 80%;
      margin: auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: none;
      // background-color: rgba(4, 1, 1, 0.53);
      // padding: 10px;
    }

    .sourceButton {
      position: absolute;
      width: 200px;
      height: 46px;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.61);
      display: none;

      .editButton {
        margin: 10px 2px;
        width: 35px;
        height: 26px;
        line-height: 26px;
        font-size: 12px;
        border: 0;
        background-color: #20a0ff;
        color: #fff;
        letter-spacing: 0px;
        cursor: pointer;
        display: inline-block;
        border-radius: 4px;
        -webkit-transition: background-color 0.4s ease-in-out;
        -moz-transition: background-color 0.4s ease-in-out;
        -o-transition: background-color 0.4s ease-in-out;
        transition: background-color 0.4s ease-in-out;
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  const config = require('../../config/index.js')

  export default {
    mixins: [BasePage],
    components: {},
    name: 'dashboard_projects',
    data () {
      return {
        searchText: '',
        activeName: 'public',
        // 一个典型列表数据格式
        publicPage: [],
        starProjects: []
      }
    },
    mounted: function () {
      this.loadMyProject()
    },
    computed: {
      hasMyData: function () {
        return this.publicPage.length > 0
      },
      hasMyStarData: function () {
        return this.starProjects.length > 0
      }
    },
    methods: {
      setting: function (item) {
        this.$router.push({
          path: '/page',
          query: {
            id: item.id
          }
        })
      },
      getUrl: function (item, isClient) {
        if (isClient) {
          let url = `${config.VIEW_PATH}${item.key}`
          var temp = new window.Image()
          temp.src = url
          return temp.src
        } else {
          return `${config.EDITOR_PATH}?key=${item.key}`
        }
      },
      getqrUrl: function (item) {
        return `https://www.liantu.com/api.php?text=${encodeURIComponent(this.getUrl(item, 1))}`
      },
      tabHandleClick (tab) {
        this.activeName = tab.name
        if (tab.name == 'public') {
          this.loadMyProject()
        } else if (tab.name == 'star') {
          this.loadStarProject()
        }
      },
      loadMyProject: function () {
        Server({
          url: 'editor/pages/publiclist',
          method: 'get',
          needLoading: true,
          data: {
          }
        }).then((res) => {
          this.publicPage = res.data.data || []
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
