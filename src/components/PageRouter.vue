<template>
  <el-tabs :class="{hideHeader:hideHeader}" v-model="editableTabsValue2" closable @tab-remove="removeTab">
    <el-tab-pane v-for="(item, index) in editableTabs2" :label="item.pageName" :name="item.key" :key="item.name">
      <component :is="item.name"></component>
    </el-tab-pane>
  </el-tabs>
</template>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
  .hideHeader {
    > .el-tabs__header {
      display: none;
    }
  }
</style>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import BaseComponent from 'src/extend/BaseComponent'
  import noPage from '../pages/noPage'
  var pagePrex = 'page-'
  var keyIndex = 0
  export default {
    mixins: [BaseComponent],
    name: 'PageRouter',
    data: function () {
      return {
        hideHeader: true,
        editableTabsValue2: '2',
        editableTabs2: [],
        tabIndex: 2
      }
    },
    components: {'page-noPage': noPage},
    mounted: function () {
      this.loadPage(this.$route.params, (data) => {
        this.setPage(data)
      })
      this.ema.bind('Page.push', (data) => {
        this.addPage(data)
      })
    },
    watch: {
      editableTabs2: function (newVal) {
        if (newVal.length > 1) {
          this.hideHeader = false
        } else {
          this.hideHeader = true
        }
      },
      '$route' (to, from) {
        if (to.path != from.path) {
          // 如果页面改变。load新页面加入
          this.loadPage(to.params, (data) => {
            this.setPage(data)
          })
        }
      }
    },
    methods: {
      loadPage: function (data, fn, isAddPage) {
        var path = isAddPage ? data.name : this.getPath()
        import('../pages/' + path + '').then(module => {
          var tempModule = Vue.extend(module.default || module)
          tempModule = tempModule.extend({
            data: function () {
              return data.data || {}
            },
            methods: data.methods || {}
          })
          keyIndex++
          Vue.component(`${pagePrex}${path.replace(/\//gi, '_')}-${keyIndex}`, tempModule)
          fn({
            pageName: data.pageName || module.pageName || '无名',
            name: `${pagePrex}${path.replace(/\//gi, '_')}-${keyIndex}`,
            key: `${pagePrex}${path.replace(/\//gi, '_')}-${keyIndex}`
          })
        }).catch(() => {
          console.error('不存在该页面', path)
          fn({
            pageName: '该页面不存在',
            name: `${pagePrex}noPage`,
            key: `${pagePrex}noPage`
          })
        })
      },
      addPage (data) {
        this.loadPage(data, (data) => {
          this.editableTabs2.push(data)
          this.editableTabsValue2 = data.key
        }, true)
      },
      setPage: function (data) {
        this.editableTabs2 = []
        this.editableTabs2.push(data)
        this.editableTabsValue2 = data.key
      },
      removeTab (targetName) {
        let tabs = this.editableTabs2
        let activeName = this.editableTabsValue2
        var indexTab = 0
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.key === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.key
              }
              indexTab = index
            }
          })
        }
        this.editableTabsValue2 = activeName
        this.editableTabs2.splice(indexTab, 1)
      },
      getPath () {
        var params = this.$route.params
        var arr = []
        for (var k in params) {
          arr.push(params[k])
        }
        if (arr.length == 0) arr.push('home')
        return arr.join('/')
      }
    }
  }
</script>

