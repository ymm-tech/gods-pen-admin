<template>
  <footer class="main-footer">
    <div class="float-right hidden-xs">
      <b>Version</b> {{packageInfo.version}}
    </div>
    <strong>Copyright © 2014-2015 <a href="/">{{packageInfo.description}}</a>.</strong> All rights
    reserved.
  </footer>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">

</style>
<script type="text/ecmascript-6">
  import {mapState} from 'vuex'
  import BaseComponent from 'src/extend/BaseComponent'
  export default {
    mixins: [ BaseComponent ],
    name: 'Footer',
    data: function () {
      return {}
    },
    computed: mapState({
      packageInfo: state => state.app.packageInfo
    }),
    methods: {}
  }
</script>

