/**
 * 所有页面基础类
 */
import {mapState} from 'vuex'
export default {
  /* 父类向下传递的参数数据 */
  props: [],
  computed: mapState({
    packageInfo: state => state.app.packageInfo,
    userInfo: state => state.userInfo
  }),
  data: function () {
    return {}
  },
  // 组件是你刚被创建,组件属性计算前
  beforeCreated: function () {
  },
  // 组件创建完成,属性已绑定,但是dom还没生产,$el还不存在
  created: function () {
    this.ema = window.EMA.getProxy()
  },
  // 模板编译挂载前
  beforeMount: function () {
  },
  // 模板编译挂载之后,不保证组件已经在document中。
  mounted: function () {
    this.$options.initPageTitle()
    // 更新页面定位信息
    this.$store.dispatch('changeActiveIndex', this.$options.name)
    console.info('当前页面', this.$options.name)
  },
  // 组件更新之前
  beforeUpdate: function () {
  },
  // 组件更新之后
  updated: function () {
  },
  // keep-alive 会用到
  // 组件被激活
  activated: function () {
  },
  // 组件被移除
  deactivated: function () {
  },
  beforDestroy: function () {
  },
  destroyed: function () {
    this.ema.dispose()
  },
  initPageTitle: function () {
    if (this.pageName) {
      document.title = this.pageName
    }
  },
  methods: {
    /**
     * 组件内部范围绑定事件
     * @param key
     * @param fn
     */
    bindEvent: function (key, fn) {
      if (!this.$options.name) {
        console.warn('绑定事件的组件不存在组件名称', key)
      }
      this.ema.bind(`${this.$options.name}.${key}`, fn)
    },
    /**
     * 打开一个弹出框
     * @param data
     *  {
     *    name:'', //弹出框名称,dialog目录下弹出框名称
     *    data:{}, //传给弹出框的基础数据 data能包含数据
     *    methods:{} //传给弹出框的基础方法。方便回调等操作
     *  }
     */
    openDialog: function (data) {
      this.ema.fire('Dialogs.push', data)
    },
    /**
     * 添加一个页面到当前页面，必要参数
     * {
     *  name: 页面名称
     *  data:{}  数据覆盖
     *  methods:{}  方法覆盖
     * }
     * @param data
     */
    addPage: function (data) {
      this.ema.fire('Page.push', data)
    }
  }
}
