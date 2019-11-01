import Vue from 'vue'
import ElementUI from 'element-ui'
import updatePassword from './updatePassword.vue'
import 'element-ui/lib/theme-chalk/index.css'
require('./assets/js/base')
require('./assets/style/base.css')
import EmaProxy from 'ema-proxy'
window.EMA = new EmaProxy()

Vue.use(ElementUI)
Vue.config.devtools = !(process.env.NODE_ENV === 'production')

new Vue({
  el: '#app',
  render: h => h(updatePassword)
})
