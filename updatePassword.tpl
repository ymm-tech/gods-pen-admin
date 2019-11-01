<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="app" ></div>
    <% if (/^[0-9a-zA-Z]{10,}$/.test(htmlWebpackPlugin.options.hmid)) { %>
    <script defer type="text/javascript" src="https://hm.baidu.com/hm.js?<%= htmlWebpackPlugin.options.hmid %>"></script>
    <% } %>
    <% if (process.env.NODE_ENV === 'production') { %>
        <script src="//cdn.staticfile.org/vue/2.5.16/vue.runtime.min.js"></script>
    <% } %>
  </body>
</html>
