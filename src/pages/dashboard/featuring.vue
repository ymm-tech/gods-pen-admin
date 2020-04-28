<template>
  <div v-if="userInfo.role === 1" class="content-wrapper">
    <div class='container-fluid container-limited box'>
      <div style="margin-bottom: 25px; text-align: right;">
        <el-input style="width: 200px;margin-right:20px;" placeholder="请输入页面 key" v-model="pagekey"></el-input>
        <el-button @click="updateItem({}, 1, true)">加精</el-button>
        <el-button @click="updateItem({}, 2, true)">撤销加精</el-button>
      </div>
      <div class="boxSize" v-for="(item, k) in featuringPages" :key='k'>
        <div class="sourceImg">
          <a :href="getUrl(item,true)" target="_blank" >
            <img :src="item.image||'https://ymm-maliang.oss-cn-hangzhou.aliyuncs.com/ymm-maliang/access/ymm1562307855048.png'" class="logo">
          </a>
        </div>
        <div class="sourceName">
          <i class="itemName">{{item.name}}</i>
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
          <el-button class="control-item" size="mini" @click="updateItem(item, 1)">设为精选</el-button>
          <el-button class="control-item" size="mini" type="primary" @click="updateItem(item, 2)">设为普通</el-button>
        </div>
      </div>
    </div>
    <div class="loadmore">
      <el-button @click="list" v-if="!emptylist" style="font-size: 20px;" type="text">再来一波 <i class="el-icon-refresh"></i> </el-button>
      <el-button style="font-size: 20px;" v-else type="text">暂无待审核页面</el-button>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .control-item {
    line-height 1.2
    padding 10px
  }
  .loadmore {
    text-align center
  }
  .box {
    width: 100%;
    height: 100%;
    margin-top: 50px;
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
    cursor: pointer;
    transition: transform 0.4s ease;

    .sourceName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
      font-weight: bolder;
      font-size: 16px;
      color: #333;
      line-height: 28px;
      padding: 10px 15px;

      i {
        font-style: normal;
      }

      .itemName {
        float: left;
        width: 126px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .fork {
        float: right;

        .num {
          font-weight: 400;
          color: #666;
          margin-left: 10px;
        }
      }
    }

    .bottom {
      margin-top: 10px;
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
      transform: translate3d(0, -4px, 0);
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
        z-index: 1;
        left: 0;
      }

      .logo {
        position: relative;
        width: 100%;
        z-index: 2;
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
        z-index: 3;
      }
    }

    .qr {
      float: left;
      cursor: pointer;
      top: 8px;
      margin: 0 10px;
      border: 0;

      .qrBox {
        position: relative;
        background-color: #eee;
        border-radius: 3px;
        text-align: center;
        width: 36px;
        height: 36px;
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
        background: url('../../assets/image/project/qr.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .editButton {
      display: inline-block;
      height: 32px;
      width: 60px;
      text-align: center;
      line-height: 32px;
      color: #fff;
      background: #1593ff;
      border-radius: 3px;
      float: right;
      margin-right: 20px;
    }

    .act_btn:hover {
      .actions {
        display: block;
      }
    }

    .actions {
      display: none;
      position: absolute;
      right: 21px;
      bottom: 50px;
      width: 50%;
      text-align: left;
      background-color: #fff;
      box-shadow: 0px 0px 8px #8D8E8F;
      z-index: 999;

      .action {
        font-family: PingFang-SC-Medium;
        text-decoration: none;
        color: #333;
        font-size: 13px;
        cursor: pointer;
        transition: background-color 0.4s ease-in-out;
        margin: 0;
        line-height: 25px;
        padding: 4px 10px;

        &:hover {
          background-color: #1593ff;
        }
      }

      .last {
        width: 100%;
        height: 10px;
        margin: 0;
        padding: 0;
        background-color: rgba(220, 196, 196, 0.2);
      }

      .dele:hover {
        background-color: #f56c6c;
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
    name: 'dashboard-featuring',
    data () {
      return {
        pagekey: '',
        pages: [],
      }
    },
    mounted () {
      this.list()
    },
    computed: {
      emptylist () {
        return this.pages.length === 0
      },
      featuringPages () {
        return (this.pages || []).filter(v => v.featured === 0)
      }
    },
    methods: {
      updateItem: function (item, value, bykey = false) {
        if (bykey && !/^\w{3,}$/.test(this.pagekey)) {
          return this.$message({
            type: 'error',
            message: '请输入页面 key'
          })
        }
        var me = this
        const msg = `是否设置为${value === 1 ? '精选' : '普通'}`
        me.$confirm(msg, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Server({
            url: 'editor/pages/update-featured',
            method: 'POST',
            needLoading: true,
            trimNull: false,
            data: !bykey ? {
              id: +item.id,
              value: value
            } : {
              key: this.pagekey,
              value: value
            }
          }).then(function (res) {
            if (!bykey) item.featured = value
            me.$message({
              type: 'success',
              message: '操作成功'
            })
            me.pagekey = ''
          })
        })
      },
      list () {
        Server({
          url: 'editor/pages/featuring',
          method: 'post',
          needLoading: true,
          trimNull: false,
          data: {
            month: 3
          }
        }).then((res) => {
          this.pages = res.data.data || []
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
    }
  }
</script>
