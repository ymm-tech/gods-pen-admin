<template>
  <div class="content-wrapper">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <c-new></c-new>
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
    name: 'projects_new',
    data () {
      return {
        value: '',
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
      onSubmit: function () {

      }
    }
  }
</script>
