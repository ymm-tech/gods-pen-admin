<template>
  <div class="page-with-sidebar"
       :class="[{'page-sidebar-collapsed':theme.isOpen,'page-sidebar-expanded':!theme.isOpen,'page-sidebar-pinned':theme.isLock}]">
    <c-sidebar></c-sidebar>
    <div @click="closePanel">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'
  import CSidebar from 'src/components/Sidebar'
  import {mapState} from 'vuex'

  export default {
    mixins: [ BaseComponent ],
    name: 'Content',
    data: function () {
      return {
        minHeight: 500
      }
    },
    computed: mapState({
      theme: state => state.app.theme
    }),
    components: { CSidebar },
    mounted: function () {
      this.minHeight = window.document.body.offsetHeight - 50 - 45
    },
    methods: {
      closePanel: function () {
        if (!this.theme.isOpen && !this.theme.isLock) {
          this.$store.dispatch('updataTheme', {
            isOpen: true,
            isLock: false
          })
        }
      },
      changeTheme: function (color) {
        this.$store.dispatch('updataTheme', {
          theme: color
        })
      }
    }
  }
</script>

