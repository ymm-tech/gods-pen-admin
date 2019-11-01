import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './app'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css'
import EmaProxy from 'ema-proxy'
import store from './store'
require('./assets/js/base')
require('./extend/filter')
require('./assets/style/base.css')
import * as monaco from 'monaco-editor'
import vuelint from './assets/js/vuelint'
import routerMap from './RouterMap'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.config.devtools = !(process.env.NODE_ENV === 'production')

const router = new VueRouter(routerMap)
window.router = router
let appData = {
  el: '#app',
  store: store,
  router: router,
  render: h => h(App)
}

window.EMA = new EmaProxy()

// 脚本编辑器配置自动提醒
monaco.languages.registerCompletionItemProvider('javascript', {
  provideCompletionItems: () => {
    return vuelint || []
  }
})

monaco.editor.defineTheme('maliang', {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '001dbf' },
    { token: 'string', foreground: '42a071' },
    { token: 'comment.js', fontStyle: 'italic', foreground: '93A1A1' },
    { token: 'delimiter.bracket.js', foreground: 'd63300' },
    { token: 'delimiter.parenthesis.js', foreground: 'd63300' },
    // { token: '', background: 'fefaef', foreground: '657B83'},
    // { token: 'identifier.js', foreground: '061232' },
  ],
  colors: {
    'editor.lineHighlightBackground': '#cccccc35',
    // 'editor.foreground': '#657B83',
    // 'editor.background': '#fefaef',
  }
})

export default new Vue(appData)
