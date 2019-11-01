<template>
  <el-dialog :title="title"  :visible.sync="Visible" @close="close">
    <div>
      <c-new></c-new>
    </div>
  </el-dialog>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">

</style>
<script type="text/ecmascript-6">
  import BaseDialog from 'src/extend/BaseDialog'
  import CNew from '../pages/groups/CNew.vue'
  export default {
    mixins: [ BaseDialog ],
    name: 'DGroupsNew',
    data: function () {
      return {
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    components: { CNew },
    computed: {},
    methods: {
      onSubmit () {
        console.log('submit!')
      },
      showDialog: function () {
        this.openDialog({
          name: 'DDemo2',
          data: {},
          methods: {
            oktest: function () {
              console.log(this)
              window.alert('good')
            }
          }
        })
      }
    }
  }
</script>

