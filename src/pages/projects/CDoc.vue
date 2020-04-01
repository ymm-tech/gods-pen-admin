<template>
  <div class="content">

    <div class="project-home-panel text-center">
      <div class="container-fluid container-limited">
      </div>
    </div>
    <!--页面列表信息-->
    <div v-if="!hasData">
      <div class="blank-state">
        <div class="blank-state-icon">
          <i class="ifont icon-empty"></i>
          <span>暂无页面信息，请先添加页面</span>
        </div>
        <h3 class="blank-state-title">
          <el-button @click="newApi" type="primary">添加页面</el-button>
        </h3>
      </div>
      <el-alert class="tipWarp" title="项目介绍" type="info">
        <div v-html="projectMd"></div>
      </el-alert>
    </div>
    <div class="pages clearfix" v-else>
      <div class="boxSize" v-for="(item, k) in productList" :key='k'>
        <div class="status">
          <span class="ribbon" v-bind:style="{backgroundColor: item.status == 1 ? '#86C23A' : '#f89300'}">{{item.status == 1 ? '启用' : '禁用'}}</span>
        </div>
        <div class="sourceKey" v-show='0'>{{$route.query.key+'/'+item.key}}</div>
        <div class="sourceImg">
          <img :src="item.image||'https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm1562307855048.png'" class="logo">
        </div>
        <div class="sourceName">{{item.name}}</div>
        <div class="bottom">
          <a class="qr">
            <div class="qrBox">
              <i class="eqf-QRcode"></i>
            </div>
            <a :title="item.desc" style="display: inline-block; cursor: pointer;" :href="getUrl(item,true)" target="_blank" class="erCode" >
              <img class="qrcode" :src="getqrUrl(item)" alt="">
            </a>
          </a>
          <div class="sourceButton">
            
            <a class="editButton" :href="getUrl(item)" target="_blank">编辑</a>
            <a class="editButton act_btn" target="_blank">操作
              <div class="actions">
                <p class="action" @click='setting(item)'>设置</p>
                <p class="action" @click='copy(item)'>复制</p>
                <p class="action" v-if="item.status == 1" @click="changeStatus(item)" >
                  禁用
                </p>
                <p class="action" v-if="item.status == 2" @click="changeStatus(item)" >
                  启用
                </p>
                <p class="action dele" @click="delet(item)" v-show="item.status==1">删除
                </p>
                <p class="last"></p>
              </div>
            </a>
            
          </div>
        </div>
      </div>
    </div>
    <!--页面列表信息/-->
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .project-home-panel {
    margin-bottom: 30px;
  }

  .project-home-environment {
    width: 500px;
    margin: auto;
  }

  .project-home-url {
    width: 500px;
    margin: auto;
  }

  .blank-state-icon {
    span {
      font-size: 24px;
    }
  }

  .pathWarp {
    position: relative;

    i {
      position: absolute;
      bottom: -6px;
      right: -15px;
      color: #20597e;
    }
  }

  .project-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin: 20px auto;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .boxSize {
    position: relative;
    float: left;
    text-align: center;
    background-color: white;
    width: 200px;
    min-height: 240px;
    margin: 0 1em 30px;
    border: 1px solid #ddd;
    overflow: hidden;
    border-radius: 5px;
    cursor pointer
    transition: transform 0.4s ease
    .status {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 999;
      color #fff
      span {
        font-size: 12px;
        display: block;
        padding: 0 10px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        border-top-left-radius: 4px;
        border-bottom-right-radius: 12px;
      }
    }
    .sourceName {
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      font-weight: bolder;
      font-size: 16px;
      color: #333;
      line-height: 28px;
      padding 15px
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
      cursor: pointer;
      // box-shadow: 0 10px 30px 0 hsla(0,0%,84.3%,.5);
      transform: translate3d(0,-4px,0);
      box-shadow: 0px 0px 8px #8D8E8F;
    }

    .sourceImg {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background-position: center center;
      position: relative;

      img {
      }

      .bg {
        filter: blur(10px);
        position: absolute;
        width: 100%;
        z-index 1
        left 0
      }

      .logo {
        position relative
        width: 100%;
        height: 100%;
        z-index 2
      }
    }

    .erCode {
      .qrcode {
        width: 80%;
        margin: auto;
        position: absolute;
        display: none;
        left: 0;
        right: 0;
        top: 34px;
        // background-color: rgba(4, 1, 1, 0.53);
        // padding: 10px;
        z-index 3
      }
    }
    .qr {
      float left
      cursor: pointer;
      top 8px
      margin 0 20px
      border 0
      .qrBox {
        position relative
        top 6px
        background-color: #eee;
        border-radius: 3px;
        text-align: center;
        width 36px
        height 36px
      }
      &:hover {
        .qrBox {
          background-color: #1593ff;
        }
        .qrcode {
          display: block;
        }
      }
      .eqf-QRcode {
        position: absolute;
        width: 20px;
        height: 20px;
        font-size: 20px;
        background url('../../assets/image/project/qr.png')
        background-repeat: no-repeat
        background-size: 100% 100%
        top 50%
        transform translate(-50%, -50%)
      }
    }
    .sourceButton {
      float left
      height: 46px;
      bottom: 0;
      padding-right: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .editButton {
        text-decoration:none; 
        color:#333;
        margin: 10px 2px;
        padding 6px 10px
        font-size: 13px;
        cursor: pointer;
        border: 1px solid #ccd5db;
        border-radius: 4px;
        box-sizing border-box
        transition: background-color 0.4s ease-in-out;
        &:hover {
          border-color: #1593ff;
          color: #1593ff;
        }
      }
      .act_btn:hover {
        .actions {
          display block
        }
      }
      .actions {
        display none
        position absolute
        right 21px
        bottom 50px
        width: 50%;
        text-align: left;
        background-color: #fff;
        box-shadow: 0px 0px 8px #8D8E8F;
        z-index: 999;
        .action {
          font-family: PingFang-SC-Medium;
          text-decoration:none; 
          color:#333;
          font-size: 13px;
          cursor: pointer;
          transition: background-color 0.4s ease-in-out;
          margin 0    
          line-height: 25px;
          padding: 4px 10px;
          &:hover {
            background-color: #1593ff;
          }
        }
        .last {
          width 100%
          height 10px
          margin 0  
          padding 0
          background-color: rgba(220, 196, 196, 0.2);
        }
        .dele:hover {
          background-color #f56c6c
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  const config = require('src/config')
  var projectMd = require('src/assets/tip/help/project.md')

  export default {
    mixins: [BasePage],
    components: {},
    name: 'projects_cdoc',
    props: {
      id: { // 项目id
        type: String
      }
    },
    data () {
      return {
        projectKey: '',
        projectName: '',
        projectId: null,
        categoryType: {
          1: '活动类'
        },
        productList: [],
        parameter: {
          key: '',   // 项目key
          name: '',   // 项目名称
          categoryId: '',    // 分类id,
          status: '1'    // 项目状态,
        },
        pagination: {
          total: 0,   // 总页数
          curr: 1,   // 当前页数
          size: 10   // 每页几条
        },
        projectMd: projectMd
      }
    },
    mounted: function () {
      this.projectId = this.$route.query.id - 0
      this.projectKey = this.$route.query.key
      this.projectName = window.decodeURIComponent(this.$route.query.name || '')
      this.detailInfo()
      this.bindEvent('pageAddSuccess', () => {
        this.detailInfo()
      })
    },
    computed: {
      hasData: function (list) {
        return this.productList.length > 0
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
      // 1启用、2禁用 0删除
      changeStatus: function (item) {
        var me = this
        me.status = item.status == 1 ? 2 : 1
        var isStatus = ''
        me.status == 2 ? isStatus = '禁用' : isStatus = '启用'
        me.$confirm(`确定要${isStatus}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Server({
            url: 'editor/pages/change-status',
            data: {
              id: +item.id,
              status: +me.status
            },
            needLoading: true,
            trimNull: false,
            method: 'post'
          }).then((res) => {
            me.detailInfo()
            me.$message({
              type: 'info',
              message: isStatus + '成功！'
            })
          })
        })
      },
      // 删除
      delet: function (item) {
        var me = this
        me.$confirm(`是否删除？`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Server({
            url: 'editor/pages/delete',
            method: 'POST',
            needLoading: true,
            trimNull: false,
            data: {
              id: +item.id
            }
          }).then(function (res) {
            me.$message({
              type: 'success',
              message: '删除成功!'
            })
            me.detailInfo()
          })
        })
      },
      // 详情页面挂载
      detailInfo () {
        Server({
          url: 'editor/pages/list',
          method: 'post',
          needLoading: true,
          trimNull: false,
          data: {
            projectId: this.projectId
          }
        }).then((res) => {
          this.productList = res.data.data || []
        })
      },
      // 详情
      detailPage: function (item) {
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
          methods: {
          }
        })
      },
      copy: function (item) {
        console.log(item)
        Server({
          url: 'editor/pages/detail',
          method: 'post', // default
          needLoading: false,
          data: {
            scene: 'copy',
            pageKey: item.key,
          }
        }).then((respond) => {
          console.log('bbb', respond.data.data)
          const source = respond.data.data
          this.openDialog({
            name: 'DCopyPage',
            data: {
              title: '复制页面',
              form: {
                projectId: this.$route.query.id,
                name: `复制${source.name}${Math.floor(Math.random() * 100)}`,
                desc: `复制${source.desc}${Math.floor(Math.random() * 100)}`,
                visibilitylevel: source.visibilitylevel,
                content: source.content,
                image: source.image
              }
            },
            methods: {
            }
          })
        })
      }
    }
  }
</script>
