<template>
  <div class="content-wrapper">
    <div class="alert-wrapper">
      <div class="flash-container flash-container-page">
      </div>
    </div>
    <div class="mfullpage">
      <div class="content" id="content-body">
        <div class="section">
          <div class="blank-state blank-state-welcome welcome">
            <h2 class="blank-state-welcome-title">
              欢迎加入 {{packageInfo.description}}
            </h2>
            <p class="blank-state-text">
              一个快速生成页面的编辑器
            </p>
          </div>
          <div class="cont">
            <div class="blank-state cont_blank">
              <div class="blank-state-icon">
                <i class="ifont icon-group"></i>
              </div>
              <h3 class="blank-state-title">
                创建团队，管理自己的项目
              </h3>
              <p class="blank-state-text">
                所有的项目都在每个团队中，便于管理自己的项目
              </p>
              <router-link class="btn btn-new" to="groups/new">创建团队
              </router-link>
            </div>
            <div class="blank-state cont_blank">
              <div class="blank-state-icon">
                <i class="ifont icon-project"></i>
              </div>
              <h3 class="blank-state-title">
                创建自己的项目
              </h3>
              <!-- <p class="blank-state-text">
                你可以免费创建
                <strong>20</strong>
                个项目.(当然是骗你的)
              </p> -->
              <router-link class="btn btn-new" to="/projects/new">新建项目
              </router-link>
            </div>
            <div class="blank-state cont_blank">
              <div class="blank-state-icon">
                <img src="../assets/image/comp.png" alt="" class='compImg'>
              </div>
              <h3 class="blank-state-title">
                查看精选模板
              </h3>
              <!-- <p class="blank-state-text">
                你可以免费创建
                <strong>20</strong>
                个项目.(当然是骗你的)
              </p> -->
              <router-link class="btn btn-new" to="/dashboard/featured">查看精选
              </router-link>
            </div>
          </div>
          <div style="padding-bottom: 100px"></div>
          <div class="arrow-down" @click="moveSectionDown"></div>
        </div>
        <div class="section section-vertical-top" style="transform: translateY(-30px);">
          <el-card class="box-card" ref='box-card' desc='今日数据'>
            <div class="card-title">今日概览</div>
            <el-table
              v-if="todayData && !todayData.byES"
              :data="todayData"
              size='small'
              stripe
              style="width: 100%">
              <el-table-column
                prop=""
                width='20'
                label="">
              </el-table-column>
              <el-table-column
                prop="null"
                width='80'
                label="">
              </el-table-column>
              <el-table-column
                prop="pv_count"
                label="浏览量(PV)"
                align='right'>
              </el-table-column>
              <el-table-column
                prop="visitor_count"
                label="访客数(UV)"
                align='right'>
              </el-table-column>
              <el-table-column
                prop="ip_count"
                align='right'
                label="IP数">
              </el-table-column>
              <el-table-column
                prop="bounce_ratio"
                align='right'
                label="跳出率">
              </el-table-column>
              <el-table-column
                prop="avg_visit_time"
                align='right'
                label="平均访问时长">
              </el-table-column>
              <el-table-column
                prop=""
                width='40'
                label="">
              </el-table-column>
            </el-table>
            <el-table v-if="todayData && todayData.byES" :data="todayData" size='small' stripe style="width: 100%">
              <el-table-column prop="" width='20' label="">
              </el-table-column>
              <el-table-column prop="name" width='80' label="">
              </el-table-column>
              <el-table-column label="浏览量(PV)" align='right'>
                <template slot-scope="{row}">
                  <el-tooltip class="item" v-if="row.maxpvDate" effect="dark" :content="row.maxpvDate" placement="bottom">
                    <span>{{row.pv | numberSplit(1)}}</span>
                  </el-tooltip>
                  <span v-else>{{row.pv | numberSplit(1)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="访客数(UV)" align='right'>
                <template slot-scope="{row}">
                  <el-tooltip class="item" v-if="row.maxuvDate" effect="dark" :content="row.maxuvDate" placement="bottom">
                    <span>{{row.uv | numberSplit(1)}}</span>
                  </el-tooltip>
                  <span v-else>{{row.uv | numberSplit(1)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="平均访问时长(秒)" align='right'>
                <template slot-scope="{row}">
                  <span>{{row.viewtime}}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="ip_count"
                align='right'
                label="IP数">
              </el-table-column>
              <el-table-column
                prop="bounce_ratio"
                align='right'
                label="跳出率">
              </el-table-column>
              <el-table-column
                prop="avg_visit_time"
                align='right'
                label="平均访问时长">
              </el-table-column> -->
              <el-table-column prop="" width='40' label="">
              </el-table-column>
            </el-table>
          </el-card>
          <el-card class="box-card" desc='历史趋势'>
            <chart v-if="chartHeight && historyTrend.x" class="mchart" :style="{height: chartHeight}" style="width: 85%" :options='historyTrendOptions'></chart>
            <div style="float: left; width: 13.5%;" v-if='historyTrend.sum'>
              <p class="sum-title">累计 PV</p>
              <p class="sum-num">{{historyTrend.sum.pv_count}}</p>
              <p class="sum-title">累计 UV</p>
              <p class="sum-num">{{historyTrend.sum.visitor_count}}</p>
              <p class="sum-title">页面数</p>
              <p class="sum-num">{{pageCount}}</p>
            </div>
          </el-card>
          <el-card class="box-card" desc='今日趋势'>
            <chart v-if="chartHeight && todayTrend.x" :style="{height: chartHeight}" class="mchart" :options='todayTrendOptions'></chart>
          </el-card>
          <el-card class="box-card" desc='今日热览'>
            <div class="card-title">今日热览</div>
            <el-table stripe @mousewheel.native.stop='() => {}' :data="todayEntries" height='100%' size='mini' style="width: 100%;min-height:300px">
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column prop="" label="标题">
                <template slot-scope="{row}">
                  <span :title="row.desc">{{row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" width="120" align='center' label="页面ID">
                <template slot-scope="{row}">
                  <a target="_blank" :href='row.url'>{{row.key}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="pv_count" width="120" label="浏览量(PV)" align='right'>
              </el-table-column>
              <el-table-column prop="visitor_count" width="120" label="访客数(UV)" align='right'>
              </el-table-column>
              <el-table-column prop="viewtime" width="120" label="平均访问时长(秒)" align='right'>
              </el-table-column>
              <el-table-column v-if="0" prop="detail" align='right' label="详细数据">
                <template slot-scope="{row}">
                  <a target="_blank" :href="'#/page?id='+row.id">查看</a>
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="bounce_ratio"
                align='right'
                label="跳出率">
              </el-table-column>
              <el-table-column
                prop="avg_visit_time"
                align='right'
                label="平均访问时长">
              </el-table-column>
              <el-table-column
                prop=""
                width='40'
                label="">
              </el-table-column> -->
            </el-table>
          </el-card>
        </div>
        <!-- <div class="section">
          Some section
        </div>
        <div class="section">
          Some section
        </div> -->
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .mfullpage >>> .fp-tableCell {
    height 100%
    vertical-align: inherit;
  }
  .welcome {
    padding 100px 0
  }
  .cont {
    padding-top 100px
    display flex
    .cont_blank {
      flex 1
      & >>> .blank-state-text {
        margin-bottom 0
      }
      .btn {
        margin-top 20px
      }
      .compImg {
        width 56px
        height 56px
      }
    }
  }
  .pd50 {
    padding-bottom: 50px;
  }

  .box-card {
    height: calc(47% - 25px);
    width: 49%;
    margin: 1% 0.5% 0;
    box-shadow:none;
    &:nth-child(2n) {
      float: right;
    }

    &:nth-child(2n+1) {
      float: left;
    }
  }

  .sum-title {
    font-size: 25px;
    font-weight: lighter;
    line-height: 1;
    margin-top: 37px;
    text-align: right;
    margin-bottom: 5px;
    color: #666;
  }

  .sum-num {
    font-size: 21px;
    color: #0091fd;
    text-align: right;
    white-space: nowrap;
  }

  .card-title {
    text-align: center;
  }

  .mchart {
    float: left;
    height: 100%;
    width: 100%;
  }

  .section {
    position: relative;
  }

  .arrow-down {
    position: absolute;
    bottom: 10%;
    left: 50%;
    cursor: pointer;
    margin-left: -25px;
    width: 50px;
    height: 50px;
    background-image: url('../assets/image/Arrow_Down.png');
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100% 100%;
    opacity: 0.5;
    animation: pageDown 1.4s ease-in-out infinite;
  }

  @keyframes pageDown {
    0% {
      transform: translateY(0%);
    }

    50% {
      transform: translateY(40%);
    }

    100% {
      transform: translateY(0);
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import Server from 'src/extend/Server'
  import {baiduTongjiAjax, numberSplit, combineTongjiData, splitTrendData} from '../extend/Util'
  import {line} from '../extend/chartOptions'
  let Chart = require('vue-echarts')
  import 'echarts/lib/chart/line'
  const config = require('../config/index.js')

  var pages

  export default {
    mixins: [BasePage],
    components: {Chart},
    name: 'home',
    data () {
      return {
        todayData: [],
        historyTrend: {},
        todayEntries: [],
        todayTrend: {},
        pageCount: '',
        chartHeight: 0
      }
    },
    computed: {
      historyTrendOptions () {
        var {x, y} = this.historyTrend
        if (!x) return {}
        return line({
          title: '历史趋势',
          seriesNames: ['浏览量(PV)', '访客数(UV)'],
          legendAlign: 'left',
          x,
          y: [y && y.pv_count, y && y.visitor_count]
        })
      },
      todayTrendOptions () {
        var {x, y} = this.todayTrend
        if (!x) return {}
        return line({
          title: '今日趋势',
          dataZoom: false,
          seriesNames: ['浏览量(PV)', '访客数(UV)'],
          legendAlign: 'left',
          x,
          y: [y && y.pv_count, y && y.visitor_count]
        })
      }
    },
    filters: {
      getPageId (url) {
        return url.replace(/^.+tview\//, '').replace(/\?.*$/, '')
      }
    },
    async mounted () {
      // eslint-disable-next-line
      pages = new window.fullpage('#content-body', {
        autoScrolling: true,
        navigation: true,
        licenseKey: null,
        scrollHorizontally: true
      })
      Promise.all([this.makeHeight(), this.getTodayDataByES(), this.getHistoryTrendByES(), this.getTodayEntriesByES(), this.getTodayTrendByES(), this.getPageCount()])
    },
    methods: {
      goDetail: function (params) {
        console.log(params)
      },
      moveSectionDown () {
        pages && pages.moveSectionDown()
      },
      async makeHeight () {
        await this.$nextTick()
        this.chartHeight = this.$refs['box-card'].$el.clientHeight - 40 + 'px'
      },
      async getTodayData () {
        let result = await baiduTongjiAjax({
          method: 'overview/getOutline'
        })
        this.todayData = combineTongjiData(result)
      },
      async getTodayDataByES () {
        var result
        var query = {
          appId: 'tview'
        }
        result = await Server({
          url: 'statistics/getTodayOutline',
          method: 'post',
          data: query
        }).then(({data}) => {
          return data.data || {}
        }).catch(() => {
        })
        var now = Date.now()
        var todayStart = now - (now + 8 * 3600000) % 86400000
        var yesterdayStart = todayStart - 86400000
        var viewtimes = {
          today: await this.getViewTime('', [todayStart, now]),
          yesterday: await this.getViewTime('', [yesterdayStart, todayStart]),
          yesterdayNow: 'n/a',
          avg: await this.getViewTime('', [new Date('2018/12/01').getTime()]),
        }
        result.map(n => {
          n.viewtime = viewtimes[n.key]
        })
        result.byES = 1
        this.todayData = result
      },
      async getHistoryTrend () {
        let result = await baiduTongjiAjax({
          start_date: '20180322',
          end_date: new Date().Format('yyyyMMdd'),
          metrics: 'visitor_count,pv_count',
          gran: 'day',
          method: 'trend/time/f'
        })
        var trendData = splitTrendData(result, ['pv_count', 'visitor_count'])
        trendData.sum = {
          pv_count: numberSplit(trendData.sum.pv_count),
          visitor_count: numberSplit(trendData.sum.visitor_count),
        }
        this.historyTrend = trendData
      },
      async getHistoryTrendByES () {
        var result
        var now = Date.now()
        var query = {
          timePeriod: [0, now],
          interval: 'day',
          size: 0,
          appId: 'tview'
        }
        result = await Server({
          url: 'statistics/getPUV',
          method: 'post',
          data: query
        }).then(({data}) => {
          return data.data || {}
        }).catch(() => {
        })
        var histogram = (result.histogram || [])
          .reduce((o, i) => {
            o['x'].push(i.dateStr.replace(' 00:00:00', ''))
            o['y']['pv_count'].push(i.pv)
            o['y']['visitor_count'].push(i.uv)
            return o
          }, {
              x: [],
              y: {
                pv_count: [],
                visitor_count: [],
              }
            })
        var trendData = {
          sum: {
            pv_count: result.sum.pv,
            visitor_count: result.sum.uv,
          },
          ...histogram
        }
        this.historyTrend = trendData
      },
      async getTodayEntries () {
        var result = await baiduTongjiAjax({
          method: 'visit/landingpage/a',
          start_date: new Date().Format('yyyyMMdd'),
          end_date: new Date().Format('yyyyMMdd'),
          order: 'pv_count,desc',
          max_results: 20,
          metrics: 'pv_count,visitor_count,ip_count,bounce_ratio,avg_visit_time',
        })
        var combinedData = combineTongjiData(result, true)
        let ids = combinedData.map(c => {
          let title = c.visit_page_title
          c.url = title.name
          c.pageId = title.pageId
          c.key = title.name.replace(/^.+tview\//, '').replace(/\?.*$/, '')
          return c.key
        })
        // eslint-disable-next-line
        let names = await this.getNameByKeys(ids)
        let namesMap = names.reduce((a, n) => {
          a[n.key] = n
          return a
        }, {})
        combinedData.map(c => {
          Object.assign(c, namesMap[c.key])
        })
        this.todayEntries = combinedData
      },
      async getTodayEntriesByES () {
        var now = Date.now()
        var query = {
          timePeriod: [now - (now + 8 * 3600000) % 86400000, now],
          interval: 'hour',
          size: 20,
          appId: 'tview'
        }
        var result = await Server({
          url: 'statistics/getPages',
          method: 'post',
          data: query
        })
          .then(({data}) => data.data)
          .catch(console.log)

        let list = result.list || []
        let ids = list.map(i => i.key)
        let names = await this.getNameByKeys(ids)
        let viewtimes = await this.getTodayViewTimes(ids)
        let namesMap = (names || []).reduce((a, n) => {
          a[n.key] = n
          return a
        }, {})
        let combinedData = list.map(r => {
          var nameInfo = namesMap[r.key] || {}
          return {
            desc: nameInfo['desc'],
            id: nameInfo['id'],
            name: nameInfo['name'],
            url: `${config.VIEW_PATH}${r.key}`,
            key: r.key,
            pv_count: numberSplit(r.pv),
            visitor_count: numberSplit(r.uv),
            viewtime: viewtimes[r.key]
          }
        })
        this.todayEntries = combinedData
      },
      async getTodayTrend () {
        var result = await baiduTongjiAjax({
          method: 'trend/time/f',
          start_date: new Date().Format('yyyyMMdd'),
          end_date: new Date().Format('yyyyMMdd'),
          order: 'pv_count,desc',
          gran: 'hour',
          metrics: 'visitor_count,pv_count',
        })
        var trendData = splitTrendData(result, ['pv_count', 'visitor_count'])
        this.todayTrend = trendData
      },
      async getTodayTrendByES () {
        var result
        var now = Date.now()
        var todayStart = now - (now + 8 * 3600000) % 86400000
        // eslint-disable-next-line
        var defaultHistogram = Array.apply(null, {length: 24}).map((_, i) => {
          var ts = todayStart + 3600000 * i
          return {
            date: ts,
            dateStr: new Date(ts).Format('yyyy/MM/dd hh:mm:ss'),
            pv: 0,
            uv: 0,
          }
        })
        var query = {
          timePeriod: [todayStart, now],
          interval: 'hour',
          size: 0,
          appId: 'tview'
        }
        result = await Server({
          url: 'statistics/getPUV',
          method: 'post',
          data: query
        }).then(({data}) => {
          return data.data || {}
        }).catch(() => {
        })
        var histogram = (result.histogram || [])
          .concat(defaultHistogram.slice(result.histogram.length - 24))
          .reduce((o, i) => {
            o['x'].push(i.dateStr.replace(' 00:00:00', ''))
            o['y']['pv_count'].push(i.pv)
            o['y']['visitor_count'].push(i.uv)
            return o
          }, {
              x: [],
              y: {
                pv_count: [],
                visitor_count: [],
              }
            })
        var trendData = {
          sum: {
            pv_count: result.sum.pv,
            visitor_count: result.sum.uv,
          },
          ...histogram
        }
        this.todayTrend = trendData
      },
      async getPageCount () {
        var result = await Server({
          url: 'editor/pages/count',
          method: 'get',
        })
          .then(({data}) => {
            return data && data.data && data.data.count
          })
        this.pageCount = numberSplit(result) || ''
      },
      async getNameByKeys (ids) {
        let names = await Server({
          url: 'editor/pages/getNameBykeys',
          method: 'post',
          data: {
            ids,
          }
        }).then(({data}) => {
          return data && data.data && data.data.names
        })
        return names
      },
      async getTodayViewTimes (ids) {
        var now = Date.now()
        var todayStart = now - (now + 8 * 3600000) % 86400000
        var viewtimes = {}
        for (let id of ids) {
          viewtimes[id] = await this.getViewTime(id, [todayStart, now])
        }
        return viewtimes
      },
      async getViewTime (pageKey = '', timePeriod) {
        var query = {
          pageId: pageKey,
          timePeriod: timePeriod,
          interval: 'day',
          appId: 'tview',
          avgonly: 1
        }
        var result = await Server({
          url: 'statistics/getViewTime',
          method: 'post',
          data: query
        }).then(({data}) => {
          return data.data || {}
        }).catch((e) => {
          console.error(e)
          return { avarage: 'n/a' }
        })
        return result.avarage
      },
    },
    beforeDestroy () {
      pages.destroy('all')
    }
  }
</script>
