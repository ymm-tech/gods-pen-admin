<template>
  <div id="error" class="error-page">
    <h2 class="headline text-yellow"> 404</h2>
    <div class="error-content">
      <h3><i class="fa fa-warning text-yellow"></i> 页面找不到了</h3>
      <p>
        <a href="/home">回到首页</a>
      </p>
    </div><!-- /.error-content -->
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .error-page {
    width: 600px;
    margin: 20px auto 0
  }
  .text-yellow{
    color: #20A0FF;
  }
  @media (max-width: 991px) {
    .error-page {
      width:100%
    }
  }
  a{
    color: #20A0FF;
  }
  .error-page>.headline {
    float: left;
    font-size: 100px;
    font-weight: 300
  }

  @media (max-width: 991px) {
    .error-page>.headline {
      float:none;
      text-align: center
    }
  }

  .error-page>.error-content {
    margin-left: 190px;
    display: block
  }

  @media (max-width: 991px) {
    .error-page>.error-content {
      margin-left:0
    }
  }

  .error-page>.error-content>h3 {
    font-weight: 300;
    font-size: 25px
  }

  @media (max-width: 991px) {
    .error-page>.error-content>h3 {
      text-align:center
    }
  }

</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  export default{
    mixins: [ BasePage ],
    components: {}
  }
</script>
