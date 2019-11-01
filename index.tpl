<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="stylesheet" type="text/css" href="<%= BASE_URL %>fullpage.min.css">
  </head>
  <body class='ui_blue'>
    <div id="app" ></div>
    <script src="//cdn.staticfile.org/babel-polyfill/6.20.0/polyfill.min.js"></script>
    <script src="//cdn.staticfile.org/jquery/3.1.1/jquery.min.js"></script>
    <script src="//cdn.staticfile.org/jquery-scrollTo/2.1.2/jquery.scrollTo.min.js"></script>
    <script src="//cdn.staticfile.org/plupload/2.1.9/moxie.min.js"></script>
    <script src="//cdn.staticfile.org/plupload/2.1.9/plupload.full.min.js"></script>
    <script src="<%= BASE_URL %>fullpage.min.js"></script>
    <% if (/^[0-9a-zA-Z]{10,}$/.test(htmlWebpackPlugin.options.hmid)) { %>
    <script defer type="text/javascript" src="https://hm.baidu.com/hm.js?<%= htmlWebpackPlugin.options.hmid %>"></script>
    <% } %>
    <% if (process.env.NODE_ENV === 'production') { %>
        <script src="//cdn.staticfile.org/vue/2.5.16/vue.runtime.min.js"></script>
        <script src="//cdn.staticfile.org/vue-router/2.0.1/vue-router.min.js"></script>
        <script src="//cdn.staticfile.org/vuex/2.1.1/vuex.min.js"></script>
    <% } %>
  </body>
</html>
