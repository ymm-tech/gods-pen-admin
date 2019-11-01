<template>
  <div class="content-wrapper">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <c-new :on-success="addGroupSuccess"></c-new>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .headIcon
    width 150px
    height 150px
    // border-radius 50%
    overflow hidden
    margin 20px
    img
      width: 100%
      height 100%
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import CNew from './CNew.vue'
  export default{
    mixins: [ BasePage ],
    components: { CNew },
    name: 'groups_new',
    data () {
      return {
        // 一个典型列表数据格式
        options: [ {
          value: '1',
          label: 'H5deplov'
        }, {
          value: '2',
          label: 'Util'
        }, {
          value: '2',
          label: '添加新组'
        } ],
        value: '',
        // 一个典型列表数据格式
        form: {
          image: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          name: '',
          groupId: '',
          description: ''
        }
      }
    },
    mounted: function () {
    },
    methods: {
      addGroupSuccess: function (data) {
        if (data) {
          this.$router.push({ path: '/groups/index', query: { id: data.id } })
        }
      },
      onSubmit: function () {

      }
    }
  }
</script>
