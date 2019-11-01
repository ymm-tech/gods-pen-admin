<template>
  <div class="content-wrapper">


    <div class="flash-container flash-container-page">
    </div>


    <div class=" ">
      <div class="content">
        <div class="user-profile">
          <div class="cover-block">
            <div class="cover-controls">
            </div>
            <div class="avatar-holder">
              <img class="avatar s90" alt=""
                   :src="info.photo|defaultHeader">
            </div>
            <div class="cover-title">
              {{info.name}}
            </div>
            <div class="cover-desc">
              <span v-if="info.email" class="middle-dot-divider">
                邮箱:{{info.email}}
              </span>
            </div>
            <div class="cover-desc" v-if="info.telephone">
              电话:{{info.telephone}}
            </div>
            <ul class="nav-links center user-profile-nav">
            </ul>
          </div>

        </div>


      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">

</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'

  export default{
    mixins: [ BasePage ],
    components: {},
    name: 'user',
    data: function () {
      return {
        info: {}
      }
    },
    mounted: function () {
      var id = this.$route.query.id
      if (id && id != this.userInfo.userId) {
        Server({
          url: 'users/info',
          method: 'get',
          params: {
            uid: id
          }
        }).then((response) => {
          var data = response.data.data
          this.info = data
        })
      } else {
        this.info = this.userInfo
      }
    }
  }
</script>
