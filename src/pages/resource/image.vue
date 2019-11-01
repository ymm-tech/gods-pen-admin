<template>
  <div class="page">
    <el-form :inline="true">
      <el-form-item label="项目名称">
        <el-input v-model="parameter.name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="parameter.categoryId">
          <el-option v-for="(item,k) in typeList" :label="item.name" :value="item.id"
                     :key="k"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="search" @click="searchProductAction()">查询</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" icon="plus" @click="showEdit()">添加资源</el-button>
      </el-form-item>
    </el-form>
    <div class="boxSize" v-for="(item,k) in productList">
      <div class="sourceName">{{item.name}}</div>
      <div class="sourceImg" v-if="item.categoryId == 4">
        <img :src="item.content" alt="">
      </div>

      <div class="sourceAudio" v-if="item.categoryId == 5">
        <audio controls="controls" ref="audioPL">
          <!--<source src="http://sc1.111ttt.cn/2017/1/11/11/304112004168.mp3" type="audio/mpeg"/>-->
          <source :src="item.content" type="audio/mpeg"/>
        </audio>
      </div>
      <div class="sourceImg" v-if="item.categoryId == 6">
        <img src="../../assets/image/javascr.jpg">
      </div>

      <div class="sourceButton">
        <div class="editButton" @click="showEdit(item)">编辑</div>
        <div class="editButton" @click="delet(item)" style="background-color: #f56c6c">删除</div>
      </div>
    </div>
    <el-table :data="productList" border style="width: 100%;height: 0px;">

    </el-table>
    <!--分页-->
    <el-pagination class="paginationWarp"
                   @current-change="searchLists"
                   :current-page="pagination.curr"
                   :page-size="pagination.size"
                   layout="total, prev, pager, next, jumper"
                   :total="pagination.total">
    </el-pagination>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .page {
    background: #fff;
    padding: 15px;
    .boxSize {
      position: relative;
      float: left;
      text-align: center;
      background-color: #fff;
      width: 160px;
      min-height 152px;
      margin: 0 1em 20px;
      box-shadow: 4px 5px 5px 0 #dcdcdc
      border-radius: 2px;

      .sourceName {
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align center;
        padding 8px 0;
        font-weight: 600;
        font-size: 14px;
        color: #444;
      }
      &:hover {
        .sourceButton {
          display: block;
        }
      }
      .sourceImg {
        width: 160px;
        height: 120px;
        img {
          width: 160px;
          height: 120px;
          border-radius: 4px;
        }
      }
      .sourceAudio {
        width: 160px;
        height: 120px;
        text-align center
        audio {
          width 100px
          height 60px
        }
        img {
          width 60px
          height 60px
        }
      }
      .sourceButton {
        position: absolute;
        width: 160px;
        height: 40px;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.61);
        display: none;
        border-radius 2px
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
          -webkit-transition: background-color 0.4s ease-in-out;
          -moz-transition: background-color 0.4s ease-in-out;
          -o-transition: background-color 0.4s ease-in-out;
          transition: background-color 0.4s ease-in-out;
        }
      }
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'

  export default {
    mixins: [ BasePage ],
    components: {},
    data () {
      return {
        typeList: [], // 分类列表
        productList: [],
        parameter: {
          name: '',   // 项目名称
          categoryId: null    // 分类id,
        },
        pagination: {
          total: 0,   // 总页数
          curr: 1,   // 当前页数
          size: 10   // 每页几条
        }
      }
    },
    created: function () {
      var me = this
      if (window.sessionStorage.dataBack) {
        var dataBack = JSON.parse(window.sessionStorage.dataBack)
        me.parameter = dataBack.parameter
        me.pagination.curr = dataBack.pageNo
        window.sessionStorage.removeItem('dataBack') // 清理
      }
    },
    computed: {},
    watch: {},
    mounted: function () {
      this.searchProductAction()
      this.getTypeList()
    },
    methods: {
      // 获取分类列表
      getTypeList: function () {
        var me = this
        Server({
          url: 'editor/category/list',
          method: 'POST',
          needLoading: true,
          trimNull: false,
          data: {
            type: 3
          }
        }).then(function (res) {
          var data = res.data
          me.typeList = data.data || []
          me.typeList.map(function (item) {
            item.id = (item.id || '').toString()
          })
        })
      },
      // 获取列表
      searchLists (val) {
        var me = this
        me.searchProductAction(val)
      },
      // 添加、编辑
      showEdit: function (item) {
        var me = this
        var searchItem = { // 返回搜索
          parameter: me.parameter,
          pageNo: me.pagination.curr
        }
        if (searchItem) {
          window.sessionStorage.dataBack = JSON.stringify(searchItem) // 返回搜索缓存
        }
        if (item) {
          window.sessionStorage.resource = JSON.stringify(item)
        } else {
          window.sessionStorage.removeItem('resource')
        }
        window.location.hash = '#/visualization/dialog/d-resourceEdit'
      },
      // 查询列表
      searchProductAction: function (page = 1) {
        var me = this
        var par = Object.assign({}, me.parameter)
        if (!par.name) delete par.name
        par.categoryId ? par.categoryId = +par.categoryId : delete par.categoryId
        page && (me.pagination.curr = page)
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
          var dataInfo = respond.data.data || ''
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
            me.searchProductAction()
          })
        }).catch(() => {})
      },
      // 脚本编辑
      codeScript: function (item) {
        this.openDialog({
          name: 'visualization/dialog/d-codeScript',
          data: {
            content: item.content
          },
          methods: {}
        })
      }
    },
    filters: {}
  }
</script>
