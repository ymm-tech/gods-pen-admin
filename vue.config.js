const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const config = require('./src/config/index')

const configureWebpack = {
  resolve: {
    alias: {
      'src': path.join(__dirname, 'src')
    }
  },
  externals: {
    'jQuery': 'jQuery',
    'plupload': 'plupload',
  },
  module: {
    rules: [{
      test: /\.md$/,
      use: [
        { loader: 'html-loader' },
        { loader: 'markdown-loader' }
      ]
    }]
  },
  plugins: [new MonacoWebpackPlugin()]
}

if (process.env.NODE_ENV === 'production') {
  configureWebpack.externals.vue = 'Vue'
  configureWebpack.externals['vue-router'] = 'VueRouter'
  configureWebpack.externals.vuex = 'Vuex'
}

module.exports = {
  publicPath: '/' + config.ADMIN_NAME,
  assetsDir: 'static',
  outputDir: `dist/${config.ADMIN_NAME || 'admin'}`,
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  pages: {
    index: {
      entry: './src/main.js',
      filename: 'index.html',
      template: './index.tpl',
      title: config.ADMIN_TITLE,
      hmid: config.BAIDU_TONGJI
    },
    login: {
      entry: './src/login.js',
      filename: 'login.html',
      template: './login.tpl',
      title: config.ADMIN_TITLE,
      hmid: config.BAIDU_TONGJI
    },
    emailActive: {
      entry: './src/emailActive.js',
      filename: 'emailActive.html',
      template: './emailActive.tpl',
      title: config.ADMIN_TITLE,
      hmid: config.BAIDU_TONGJI
    },
    updatePassword: {
      entry: './src/updatePassword.js',
      filename: 'updatePassword.html',
      template: './updatePassword.tpl',
      title: config.ADMIN_TITLE,
      hmid: config.BAIDU_TONGJI
    }
  },
  devServer: {
    disableHostCheck: true,
    port: 8567,
    publicPath: '/',
  },
  configureWebpack: configureWebpack,
  chainWebpack: config => {
    config.plugins.delete('preload-index')
    config.plugins.delete('prefetch-index')

    config.plugin('define').tap(args => {
      args[0]['process.env'].CODE_ENV = JSON.stringify(process.env.CODE_ENV)
      return args
    })
    config.module
      .rule('wasm')
      .test(/\.wasm$/)
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        return {
          limit: 0
        }
      })
  }
}