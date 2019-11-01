<template>
  <div class="content-wrapper">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <section class="activities">
          <div class="nav-block top-area">
            <div class="controls">
            </div>
            <el-tabs class="nav-links" :active-name="currCategoryType" @tab-click="requestTabClick">
              <el-tab-pane v-for="item in Categorys" :name="item.name" :key="item.id">
                <span slot="label">
                  {{item.desc}}
                </span>
              </el-tab-pane>
            </el-tabs>
            <div class="nav-controls">

              <div class="dropdown inline">
                <el-input size="large" placeholder="搜索" v-model="searchName">
                </el-input>
              </div>
              <el-button @click="searchResource()">搜索</el-button>

            </div>
          </div>

          <div class="searchTags">
            <el-tag :type="tag.type||'info'" class="tag" v-for="(tag,key) in canSelectTags" :key="key" @click.native="selectTag(tag)">
              <i class="ifont icon-tag"></i>{{tag.name}}
            </el-tag>
          </div>

          <div class="content_list">

            <div class="boxSize" v-for="(item,k) in productList">
              <div class="sourceName" v-if="item.name">{{item.name}}</div>
              <div class="sourceImg" v-if="typeMap[item.categoryId+''] == 'image'">
                <img :src="item.content+'?x-oss-process=image/resize,h_200'" alt="">
              </div>

              <div class="sourceAudio" v-if="typeMap[item.categoryId+''] == 'audio'">
                <audio controls="controls">
                  <source :src="item.content" type="audio/mpeg" />
                </audio>
              </div>
              <div class="sourceVideo" v-if="typeMap[item.categoryId+''] == 'video'">
                <video controls="controls" :src="item.content">
                </video>
              </div>
              <div class="sourceImg" v-if="typeMap[item.categoryId+''] == 'script'">
                <img src="../../assets/image/javascr.jpg">
              </div>
              <div class="sourceImg" v-if="typeMap[item.categoryId+''] == 'combinedcomponent'">
                <img :src="item.icon">
              </div>

              <div class="sourceButton">
                <div class="editButton" v-if="userInfo.userId==item.userId" @click="goEditer(item)">编辑</div>
                <div class="editButton" v-if="userInfo.userId==item.userId" @click="delet(item)" style="background-color: #f56c6c">删除</div>
              </div>
            </div>

          </div>
          <!--分页-->
          <el-pagination class="paginationWarp" @current-change="searchResource" :current-page="pagination.curr" :page-size="pagination.size" layout="total, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .searchTags {
    .tag {
      margin: 10px;
      cursor: pointer;
    }
  }

  .content_list {
    border-bottom: 1px solid #dddddd;
    margin-bottom: 5px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    .boxSize {
      position: relative;
      float: left;
      text-align: center;
      background-color: #fff;
      width: 150px;
      height: 150px;
      margin: 20px 1em 20px;
      box-shadow: 4px 5px 5px 0 #dcdcdc;
      border-radius: 2px;

      .sourceName {
        background-color: rgba(0, 0, 0, 0.61);
        width: 100%;
        position: absolute;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        padding: 8px 0;
        font-weight: 600;
        font-size: 14px;
        color: #ffffff;
      }

      &:hover {
        .sourceButton {
          display: block;
        }
      }

      .sourceImg {
        width: 100%;
        height: 100%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }
      }

      .sourceAudio {
        width: 100%;
        height: 120px;
        text-align: center;
        margin-top: 50px;

        audio {
          width: 100px;
          height: 60px;
        }

        img {
          width: 60px;
          height: 60px;
        }
      }

      .sourceVideo {
        width: 100%;
        height: 120px;
        text-align: center;
        margin-top: 50px;

        video {
          width: 100%;
          height: 100%;
        }

        img {
          width: 60px;
          height: 60px;
        }
      }

      .sourceButton {
        position: absolute;
        width: 100%;
        height: 40px;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.61);
        display: block;
        border-radius: 2px;

        .editButton {
          margin: 10px 2px;
          width: 35px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          border: 0;
          background-color: #20a0ff;
          color: #fff;
          letter-spacing: 0px;
          cursor: pointer;
          display: inline-block;
          border-radius: 4px;
          transition: background-color 0.4s ease-in-out;
        }
      }
    }
  }

  .paginationWarp {
    text-align: right;
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import ResourceImage from '../resource/image'
  import Server from 'src/extend/Server'
  import {mapState} from 'vuex'

  export default {
    mixins: [BasePage],
    components: {'resourceImage': ResourceImage},
    name: 'dashboard_resources',
    data () {
      return {
        typeList: [], // 分类列表
        productList: [],
        searchName: '',
        currCategoryType: 'image',
        canSelectTags: [],
        pagination: {
          total: 0,   // 总页数
          curr: 1,   // 当前页数
          size: 40   // 每页几条
        },
        loading: false,
        list: []
      }
    },
    watch: {
      currCategoryType: {
        immediate: true,
        handler: function (params) {
          this.loadTags()
          this.searchResource()
        }
      }
    },
    computed: mapState({
      typeMap: state => {
        var obj = {}
        state.Categorys.filter(val => {
          obj[val.id] = val.name
        })
        return obj
      }, // 资源类型
      Categorys: state => {
        return state.Categorys.filter(val => {
          if (val.type == 3) {
            return true
          }
        })
      }, // 资源类型
      currCategory: function (params) {
        return this.Categorys.find(val => {
          if (val.name == this.currCategoryType) {
            return true
          }
        })
      }
    }),
    mounted: function () {
      this.loadTags()
    },
    filters: {
    },
    methods: {
      /**
       * 标签选中
       */
      selectTag: function (tag) {
        if (tag.type) {
          this.$set(tag, 'type', '')
        } else {
          this.$set(tag, 'type', 'success')
        }
        this.searchResource()
      },
      loadTags: function (params) {
        if (!this.currCategory) {
          return
        }
        Server({
          url: 'editor/tags/list',
          data: {
            categoryId: this.currCategory.id,
            name: ''
          },
          method: 'post'
        }).then((response) => {
          var data = response.data.data
          this.canSelectTags = data
        }).catch((e) => {
        })
      },
      /**
       * 点击编辑按钮前往编辑页面
       */
      goEditer (item) {
        this.$router.push({
          path: '/resource/editer', query: {id: item.id}
        })
      },
      /**
       * 切换资源分类
       */
      requestTabClick: function (a) {
        this.currCategoryType = a.name
      },
      // 添加、编辑
      showEdit: function (item) {
      },
      // 查询列表
      searchResource: function (page = 1) {
        var me = this
        if (!this.currCategory) {
          return
        }
        var par = {
          categoryId: this.currCategory.id
        }
        if (this.searchName) par.name = this.searchName
        par.categoryId ? par.categoryId = +par.categoryId : delete par.categoryId
        page && (me.pagination.curr = page)
        par.tags = this.canSelectTags.filter(val => {
          return val.type == 'success'
        })
        Server({
          url: 'editor/resources/list',
          method: 'post',
          needLoading: true,
          trimNull: false,
          mock: false,
          data: {
            ...par,
            pageSize: me.pagination.size,
            page: me.pagination.curr
          }
        }).then(function (respond) {
          var dataInfo = respond.data.data
          me.productList = dataInfo.list || []
          me.pagination.total = dataInfo.total
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
            url: 'editor/resources/delete',
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
            me.searchResource()
          })
        }).catch(() => {})
      },
      // 脚本编辑
      codeScript: function (item) {
        // this.openDialog({
        //   name: 'visualization/dialog/d-codeScript',
        //   data: {
        //     content: item.content
        //   },
        //   methods: {}
        // })
        this.$message({
          type: 'success',
          message: '暂时不支持编辑脚本!'
        })
      }
    }
  }
</script>
