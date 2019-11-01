import Vuex from 'vuex'
import Vue from 'vue'
import Metadata from 'src/store/metadata'
import Lng from 'src/store/lng/en'
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
var packageInfo = require('../../package.json')
const debug = process.env.NODE_ENV !== 'production'
if (debug) {
  Vue.use(Vuex)
}
// 初始化主题信息
var theme = {
  isOpen: false,
  isLock: true
}
var localTheme = window.localStorage.getItem('theme')
if (localTheme) {
  Object.assign(theme, JSON.parse(localTheme))
}
const state = {
  app: {
    theme: theme, // 应用主题信息。
    packageInfo,
    navIndex: 0, // 导航索引
    navTwoIndex: 0, // 导航索引
    activeIndex: null, // 当前被选中的页面唯一编号id,
    size: {
      width: 0,
      height: 0
    },
    menuData: [] // 功能菜单列表信息
  },
  Lng: Lng,
  userInfo: {},
  Categorys: [],
  Metadata
}

export default new Vuex.Store({
  strict: debug,
  state,
  actions,
  getters: getters,
  mutations
})
