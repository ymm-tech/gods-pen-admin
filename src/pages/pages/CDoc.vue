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
        </h3>
      </div>
      <el-alert class="tipWarp" title="项目介绍" type="info">
        <div v-html="projectMd"></div>
      </el-alert>
    </div>
    <div class="pages clearfix" v-else>
      
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

</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'

  export default {
    mixins: [BasePage],
    components: {},
    name: 'pages_cdoc',
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
        }
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
    }
  }
</script>
