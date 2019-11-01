<template>
  <div id="emailActive" class="emailActive">
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
</style>

<script type="text/ecmascript-6">
  import Server from './extend/Server'
  const config = require('src/config')

  export default{
    components: {},
    mounted () {
      let code = window.location.search.match(/code=([^&]+)/) && window.location.search.match(/code=([^&]+)/)[1]
      if (!code) return
      Server({
        url: 'users/activeEmail',
        needLoading: true,
        data: { code },
        method: 'post'
      }).then((response) => {
        if (response.data && response.data.code == 1) {
          this.$alert('邮箱激活成功, 请重新登录', '').then(() => {
            window.location.replace(config.ADMIN_PATH + 'login.html')
          })
        }
      }).catch((e) => {
        this.$alert(`邮箱激活失败${e}`, '').then(() => {
          window.location.replace(config.ADMIN_PATH + 'login.html')
        })
      })
    }
  }
</script>
