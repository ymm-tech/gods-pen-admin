import Vue from 'vue'
import ElementUI from 'element-ui'
import Login from './login.vue'
import EmaProxy from 'ema-proxy'
import 'element-ui/lib/theme-chalk/index.css'
require('./assets/js/base')
window.EMA = new EmaProxy()
require('./assets/style/base.css')

Vue.use(ElementUI)
Vue.config.devtools = !(process.env.NODE_ENV === 'production')

new Vue({
  el: '#app',
  render: h => h(Login)
})
