<template>
  <div class="content-wrapper">
    <div class='container-fluid container-limited box'>
      <div class="boxSize" v-for="(item, k) in productList" :key='k'>
        <div class="sourceImg">
          <a :href="getUrl(item,true)" target="_blank" >
            <img :src="item.image||'https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm1562307855048.png'" class="logo">
          </a>
        </div>
        <div class="sourceName">
          <i class="itemName">{{item.name}}</i>
          <div class="fork">
            <svg style="vertical-align: -2px;" viewBox="0 0 10 16" version="1.1" width="10" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path></svg>
            <i class="num">{{+item.fork || 0}}</i>
          </div>
        </div>
        <div class="bottom">
          <a class="qr">
            <div class="qrBox">
              <i class="eqf-QRcode"></i>
            </div>
            <a :title="item.desc" style="display: inline-block; cursor: pointer;" :href="getUrl(item,true)" target="_blank" class="erCode" >
              <img class="qrcode" :src="getqrUrl(item)" alt="">
            </a>
          </a>
          <p class="editButton" @click="useTemp(item)">立即使用</p>
            <!-- <a class="editButton act_btn" @click="delet(item)">删除</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
 .box{
    width 100%
    height 100%
    margin-top 50px
  }
  .boxSize {
    position: relative;
    float: left;
    text-align: center;
    background-color: white;
    width: 224px;
    min-height: 317px;
    margin: 0 2em 30px;
    border: 1px solid #ddd;
    // overflow: hidden;
    border-radius: 5px;
    cursor pointer
    transition: transform 0.4s ease
    .sourceName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      font-weight: bolder;
      font-size: 16px;
      color: #333;
      line-height: 28px;
      padding 10px 15px
      i {
        font-style normal
      }
      .itemName {
        float left
      }
      .fork {
        float right
        .num{
          font-weight: 400;
          color: #666;
          margin-left 10px
        }
      }
    }
    .bottom{
      margin-top 10px
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
      margin 0 10px
      border 0
      .qrBox {
        position relative
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
    .editButton {
      display: inline-block;
      height: 32px;
      width: 116px;
      text-align: center;
      line-height: 32px;
      color: #fff;
      background: #1593ff;
      border-radius: 3px;
      float: right;
      margin-right 20px
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
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import config from 'src/config/index'
  export default {
    mixins: [BasePage],
    components: {},
    name: 'dashboard_featured',
    data () {
      return {
        productList: [],
      }
    },
    mounted () {
      this.detailInfo()
      this.bindEvent('pageAddSuccess', () => {
        this.detailInfo()
      })
    },
    methods: {
      // 立即使用
      useTemp: function (item) {
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
              title: '创建页面',
              type: 'fork',
              source: {
                projectId: source.projectId,
                id: source.id
              },
              form: {
                name: `复制${source.name}${Math.floor(Math.random() * 100)}`,
                desc: `复制${source.desc}${Math.floor(Math.random() * 100)}`,
                visibilitylevel: 0,
                content: source.content,
                image: source.image
              }
            },
            methods: {
            }
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
      // 模板列表
      detailInfo () {
        Server({
          url: 'editor/pages/publiclist',
          method: 'post',
          needLoading: true,
          trimNull: false,
          data: {
            name: '',
            tags: []
          }
        }).then((res) => {
          this.productList = res.data.data || []
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
        return `https://www.kuaizhan.com/common/encode-png?large=true&data=${encodeURIComponent(this.getUrl(item, 1))}`
      },
    }
  }
</script>
