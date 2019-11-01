<template>
  <el-dialog :title="title"  :visible.sync="Visible" @close="close">
    <div class="content">
      <c-new :on-success="success"></c-new>
    </div>
    <div slot="footer" class="dialog-footer">
    </div>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .content
    .info
      position relative
      .desc
        padding 10px
      .time
        position absolute
        bottom -15px
        right 0
    .doc
      max-height 400px
      overflow: auto
</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import {mapState} from 'vuex'
  import CNew from 'src/pages/groups/CNew.vue'

  export default {
    mixins: [ BaseDialog ],
    components: { CNew },
    name: 'DAddGroup',
    data: function () {
      return {}
    },
    computed: mapState({
      Metadata: state => state.Metadata
    }),
    mounted: function () {
    },
    methods: {
      success: function (data) {
        if (data) {
          this.close()
          this.onAdd(data)
        }
      }
    }
  }
</script>

