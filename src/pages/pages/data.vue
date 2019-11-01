<template>
  <div class="">
    <div class="flash-container flash-container-page">
    </div>
    <div class="container-fluid container-limited ">
      <div class="content">
        <div class="project-members-page prepend-top-default">
          <div class="panel panel-default">
            <div class="panel-heading">
              数据
            </div>
            <div class="panel-body">
              <el-row>
                <el-col :span="24">
                  <el-form :inline="true" ref="form" :model="form" label-width="80px">
                    <el-form-item label="时间范围">
                      <el-date-picker
                        v-model="form.timeRange"
                        type="daterange"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="聚合时间">
                      <el-radio-group v-model="form.step">
                        <el-radio v-for="item in steps" :key="item.id" :label="item.id">{{item.label||item.id}}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="getData">查询</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row>
                <el-card>
                  <div slot='header'>
                    PU / UV <i class="chart-hint">点击图例可显示/隐藏对应指标</i>
                  </div>
                  <el-col :span="24" ref='puvchart'>
                    <chart v-if="trend.x" class="mchart" style="width: 100%; height: 400px;" :options='trendOptions'></chart>
                  </el-col>
                  <el-col :span="24" style="padding-bottom: 20px;">
                    <table class="trend-table" v-if="trendTable">
                      <thead>
                        <th :key="h" v-for="h in trendTable.thead">{{h}}</th>
                      </thead>
                      <tbody>
                        <tr :key="i" v-for="(row,i) in trendTable.tbody">
                          <td :key="k" v-for="(val,k) in row">{{val}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                </el-card>
              </el-row>
              <el-row>
                <el-card style="margin-top: 20px;">
                  <div slot='header'>
                    事件 <i class="chart-hint">点击具体事件可查看事件明细</i>
                  </div>
                  <el-col :span="12" style="margin-left: 50px;">
                    <el-table
                      ref="actiontable"
                      @row-click='actionSelect'
                      highlight-current-row
                      :data="actions"
                      row-class-name='action-col'
                      style="width: 100%">
                      <el-table-column
                        prop="name"
                        label="action">
                      </el-table-column>
                      <template v-for="utm in globalUtms">
                        <el-table-column
                          :key="utm"
                          :label="(utm === '__all__' ? '' : utm) + ' 计数'">
                          <template slot-scope="{row}" >
                            {{row[utm] | numberSplit(1)}}
                          </template>
                        </el-table-column>  
                      </template>
                    </el-table>
                  </el-col>
                </el-card>
              </el-row>
              <el-row>
                <el-card style="margin-top: 20px;" >
                  <div slot="header" class="clearfix">
                    <span style="color: red;font-weight:bold">{{selectedAction.name || ''}}</span>
                    <span>事件明细</span>
                  </div>
                  <h5>趋势 <i class="chart-hint">点击图例可显示/隐藏对应指标</i></h5>
                  <el-col :span="24" ref='actionchart'>
                    <chart v-if="selectedAction && actionTrend.x" class="mchart" style="width: 100%; height: 400px;" :options='actionOptions'></chart>
                  </el-col>
                  <h5 style="padding-top: 20px;clear: both;">label统计</h5>
                  <el-col :span="12" style="margin-left: 50px;" v-if="selectedAction">
                    <el-table
                      ref="labeltable"
                      @row-click='actionLabelSelect'
                      highlight-current-row
                      :data="actionLabels"
                      row-class-name='action-col'
                      style="width: 100%">
                      <el-table-column
                        prop="name"
                        label="label">
                      </el-table-column>
                      <template v-for="utm in globalUtms">
                        <el-table-column
                          :key="utm"
                          :label="(utm === '__all__' ? '' : utm) + ' 计数'">
                          <template slot-scope="{row}" >
                            {{row[utm] | numberSplit(1)}}
                          </template>
                        </el-table-column>
                      </template>
                    </el-table>
                  </el-col>
                </el-card>
              </el-row>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .searchUser {
    width: 600px;
  }
  .pvChat {
    width: 100%;
    height: 400px;
  }
  .pie-chart {
    margin-left: 100px;
    // width: 200px;
    height: 200px;
  }
  .action-col {
    cursor: pointer
    &:hover, &.current-row {
      color: #e75e40
      font-weight bold
    }
  }
  .utms-item-right {
    float: right;
    border-radius: 10px;
    padding: 0 5px;
    display: inline-block;
    margin-top: 10px;
    line-height: 20px !important;
    height: 20px;
    border: solid 1px;
    
  }
  .chart-hint {
    font-style: normal;
    font-size: 12px;
    color: #afafaf;
    font-weight: 100;
    margin-left: 7px;
  }
  .UTM-selector.el-select-dropdown__item.selected {
    &:after {
      display none 
    }
  }
  .trend-table {
    width: 90%;
    margin-left: 59px;
    margin-top: 10px;
    color #666
    tr,th {
      line-height 2
      border-bottom 1px solid #ccc
    }
    td {
      min-width 80px;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BasePage from 'src/extend/BasePage'
  import {baiduTongjiAjax, splitTrendData} from 'src/extend/Util'
  import Server from 'src/extend/Server'
  import {line} from 'src/extend/chartOptions'
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/line'

  export default {
    mixins: [BasePage],
    components: {chart: ECharts},
    name: 'pages_data',
    props: {
      id: { // 项目id
        type: String
      },
      pageKey: {
        type: String
      }
    },
    data () {
      return {
        now: new Date(),
        pickerOptions: {
          shortcuts: [['今天', 0], ['最近一周', 6], ['最近一月', 30]].map(([text, len]) => ({
            text,
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start - (86400000 * len + start.getHours() * 3600000 + start.getMinutes() * 60000 + start.getSeconds() * 1000))
              picker.$emit('pick', [start, end])
            }
          })),
          disabledDate (date) {
            return date > Date.now()
          }
        },
        steps: [
          {id: 'hour', label: '1小时'},
          {id: 'day', label: '1天'}
        ],
        form: {
          timeRange: (() => {
            var now = Date.now()
            return [new Date(now - (now + 8 * 3600000) % 86400000 - 86400000 * 6), new Date()]
          })(),
          step: 'day'
        },
        trend: {},
        actionTrend: {},
        actions: [],
        utms: [],
        pickedUtms: [],
        globalUtms: [],
        actionLabels: [],
        selectedAction: '',
        selectedActionLabel: '',
        tongjiPageId: null,
        sumData: {}
      }
    },
    watch: {
      'form.timeRange': {
        deep: true,
        immediate: true,
        handler: function (timeRange) {
          if (timeRange && (timeRange[1] - timeRange[0] > 86400000) && this.form.step !== 'day') {
            this.form.step = 'day'
            return
          }
          if (timeRange && (timeRange[1] - timeRange[0] <= 86400000) && this.form.step !== 'hour') {
            this.form.step = 'hour'
            return
          }
          this.getUtms()
          this.getData()
        }
      },
      'form.step' () {
        this.getData()
      },
      selectedAction (val) {
        if (!val) return
        this.getActionTrack(val.action || val.name)
      }
    },
    mounted () {
      // this.getActions()
      // this.getData()
      // this.getUtms()
    },
    computed: {
      trendOptions () {
        var x = this.trend.x
        if (!x) return {}
        var utms = Object.keys(this.trend).map(k => k.split('|')[0] || 'x').filter(k => k !== 'x' && k != 'viewTimes')
        utms = Array.from(new Set(utms))
        return line(
          {
            title: '  ',
            dataZoom: false,
            seriesNames: utms.reduce((o, utm) => {
              var isAll = utm === '__all__'
              o.push(`${isAll ? '总' : utm} PV`)
              o.push(`${isAll ? '总' : utm} UV`)
              return o
            }, []),
            legendAlign: 'left',
            x,
            y: utms.reduce((o, utm) => {
              o.push(this.trend[`${utm}|pv`])
              o.push(this.trend[`${utm}|uv`])
              return o
            }, [])
          },
          {
            seriesNames: ['平均访问时长'],
            y: [this.trend.viewTimes],
            unit: 's'
          }
        )
      },
      actionOptions () {
        var x = this.actionTrend.x
        if (!x) return {}
        var utms = Object.keys(this.actionTrend).map(k => k.split('|')[0] || 'x').filter(k => k !== 'x')
        utms = Array.from(new Set(utms))
        return line({
          title: '  ',
          dataZoom: false,
          seriesNames: utms.reduce((o, utm) => {
            var isAll = utm === '__all__'
            o.push(`${isAll ? '' : utm} 事件计数`)
            o.push(`${isAll ? '' : utm} 用户计数`)
            return o
          }, []),
          legendAlign: 'left',
          x,
          y: utms.reduce((o, utm) => {
            o.push(this.actionTrend[`${utm}|count`])
            o.push(this.actionTrend[`${utm}|distinct_user`])
            return o
          }, []),
        })
      },
      selectedActionListByUtm () {
        var selectedAction = this.selectedAction
        if (!selectedAction) return null
        return Object.keys(selectedAction).reduce((o, k) => {
          if (k === 'name') return o
          o.push({
            name: k,
            metric: selectedAction[k],
          })
          return o
        }, [])
      },
      selectedLabelListByUtm () {
        var selectedActionLabel = this.selectedActionLabel
        if (!selectedActionLabel) return null
        return Object.keys(selectedActionLabel).reduce((o, k) => {
          if (k === 'name') return o
          o.push({
            name: k,
            metric: selectedActionLabel[k],
          })
          return o
        }, [])
      },
      globalUtmsColors () {
        return this.globalUtms.reduce((o, i) => {
          o[i] = `rgb(${[1, 2, 3].map(i => (Math.random() * 125 | 0) + 125).join(',')})`
          return o
        }, {})
      },
      trendTable () {
        var trend = this.trend
        if (!trend || !trend.x || !trend.x.length) return null
        var theadkeys = Object.keys(trend).filter(k => k !== 'x' && k != 'viewTimes')
        theadkeys.unshift('x')
        theadkeys.push('viewTimes')
        var thead = theadkeys.map(k => ({
          x: '时间',
          viewTimes: '平均访问时长（秒）'
        })[k] || (k || '').replace(/__all__|\|/g, ' ').replace(/pv|uv/g, m => m.toUpperCase()))
        var tbody = trend.x.map((x, index) => {
          return theadkeys.map(k => (trend[k] || [])[index] || 0)
        })
        tbody.push(theadkeys.map(k => k == 'x' ? '总计' : (this.sumData[k] || 0)))
        tbody.push(theadkeys.map(k => k == 'x' ? '累计独立访客' : !k.includes('uv') ? '-' : (this.sumData[k.replace('uv', 'user')] || 0)))
        return {
          thead,
          tbody
        }
      }
    },
    methods: {
      async getTongjiPageId () {
        if (this.tongjiPageId) return this.tongjiPageId
        var result
        result = await baiduTongjiAjax({
          method: 'visit/toppage/a',
          start_date: new Date(new Date() - 86400000 * 90).Format('yyyyMMdd'),
          end_date: new Date().Format('yyyyMMdd'),
          order: 'pv_count,desc',
          gran: this.form.step,
          metrics: 'visitor_count,pv_count',
          searchWord: '5A1F4D60a6',
          // searchWord: this.pageKey,
        })
        try {
          this.tongjiPageId = result.items['0']['0']['0'].pageId
        } catch (e) {
          this.tongjiPageId = 'not found'
          console.error('无此页面记录')
        }
        return this.tongjiPageId
      },
      async getData () {
        var useES = 1
        if (!useES) {
          await this.getTrendByBaidu()
        } else {
          if (!(this.pickedUtms && this.pickedUtms.length > 0)) this.globalUtms = ['__all__']
          else this.globalUtms = this.pickedUtms
          this.selectedAction = ''
          this.selectedActionLabel = ''
          await Promise.all([
            this.getPUVTrendByES(),
            this.getActions(),
            this.selectedAction ? this.getActionTrack(this.selectedAction.name) : 1
          ])
        }
      },
      async getTrendByBaidu () {
        function transformDate (date) {
          if (!date) date = new Date()
          if (typeof date !== 'object') date = new Date(date)
          return date.Format('yyyyMMdd')
        }
        var result
        var loading = this.$loading({target: this.$refs['puvchart'] && this.$refs['puvchart'].$el})
        var pageId = await this.getTongjiPageId()
        if (pageId === 'not found' || !pageId) return loading.close()
        result = await baiduTongjiAjax({
          method: 'trend/history/f',
          start_date: transformDate(this.form.timeRange[0]),
          end_date: transformDate(this.form.timeRange[1]),
          order: 'pv_count,desc',
          gran: this.form.step,
          flag: 'visit_toppage',
          metrics: 'visitor_count,pv_count',
          visitor: 'all',
          pageId,
        })
        loading.close()
        var trendData = splitTrendData(result, ['pv_count', 'visitor_count'])
        console.log(trendData)
        this.trend = trendData
      },
      async getPUVTrendByES () {
        var that = this
        var loading = this.$loading({target: this.$refs['puvchart'] && this.$refs['puvchart'].$el})
        var utms = this.globalUtms.slice(0)
        // 多utm数据
        var trends = await Promise.all(utms.map(utm => action(utm)))
        // 数据处理
        trends = this.utmTrend(trends, utms)
        // 访问时间
        var viewTimes = await this.getViewTime()
        if (viewTimes && trends && trends.x) {
          trends.viewTimes = trends.x.map(time => {
            var filteredTime = viewTimes.trend.filter(t => new Date(time).getTime() == t.date)
            return filteredTime && (filteredTime[0] || {}).avarage || 0
          })
        }
        this.trend = trends
        loading.close()
        return
        async function action (utm) {
          var query = {
            pageId: that.pageKey,
            timePeriod: that.form.timeRange.map(t => t.getTime && t.getTime() || 0),
            interval: that.form.step,
            size: 0,
            appId: 'tview'
          }
          if (utm && utm !== '__all__') query.utm = utm
          var result = await Server({
            url: 'statistics/getPUV',
            method: 'post',
            data: query
          }).then(({data}) => {
            return data.data || {}
          }).catch((e) => {
            console.error(e)
            return { histogram: [] }
          })
          var histogram = result.histogram
          var trendData = histogram.map(i => {
            i.utm = utm
            return i
          })
          that.sumData[`${utm || '__all__'}|pv`] = result.sum.pv
          that.sumData[`${utm || '__all__'}|uv`] = result.sum.uv
          that.sumData[`${utm || '__all__'}|user`] = result.sum.user
          return trendData
        }
      },
      async getActions () {
        var that = this
        var utms = this.globalUtms.slice(0)
        // 获取数据
        var actions = await Promise.all(utms.map(utm => operation(utm)))
        actions = this.utmTable(actions, utms)
        this.actions = actions
        async function operation (utm) {
          var result
          var query = {
            pageId: that.pageKey,
            timePeriod: that.form.timeRange.map(t => t.getTime && t.getTime() || 0),
            size: 100,
            appId: 'tview'
          }
          if (utm && utm !== '__all__') query.utm = utm
          result = await Server({
            url: 'statistics/getActions',
            method: 'post',
            data: query
          }).then(({data}) => {
            return data.data || {}
          }).catch((e) => {
            console.error(e)
            return { list: [] }
          })
          var actions = result.list.filter(a => ['pageview', 'PV_TIME'].indexOf(a.action) == -1).map(i => {
            i.metric = i.count
            i.name = i.action
            i.utm = utm
            return i
          })
          return actions
        }
      },
      async getUtms () {
        var result
        var query = {
          pageId: this.pageKey,
          // pageId: 'page_1',
          timePeriod: this.form.timeRange.map(t => t.getTime && t.getTime() || 0),
          size: 20,
          appId: 'tview'
        }
        result = await Server({
          url: 'statistics/getUtms',
          method: 'post',
          data: query
        }).then(({data}) => {
          return data.data || {}
        }).catch((e) => {
          console.log(e)
        })
        this.utms = result.list || []
      },
      async getActionTrack (action) {
        var that = this
        var loading = this.$loading({target: this.$refs['actionchart'] && this.$refs['actionchart'].$el})
        var utms = this.globalUtms.slice(0)
        var actionsAndlabels = await Promise.all(utms.map(utm => operation(utm)))
        var {trend, labels} = actionsAndlabels.reduce((o, i) => {
          o.trend.push(i.trend || {})
          o.labels.push(i.labels || {})
          return o
        }, {trend: [], labels: []})
        this.actionTrend = this.utmTrend(trend, utms, ['count', 'distinct_user'])
        this.actionLabels = this.utmTable(labels, utms)
        loading.close()
        async function operation (utm) {
          var query = {
            pageId: that.pageKey,
            timePeriod: that.form.timeRange.map(t => t.getTime && t.getTime() || 0),
            action: action,
            size: 0,
            interval: that.form.step,
            appId: 'tview'
          }
          if (utm && utm !== '__all__') query.utm = utm
          var result = await Server({
            url: 'statistics/actionTrack',
            method: 'post',
            data: query
          }).then(({data}) => {
            return data.data || {}
          }).catch((e) => {
            console.error(e)
            return { histogram: [], labels: [] }
          })
          var histogram = result.histogram
          var trend = histogram.map(i => {
            i.utm = utm
            return i
          })
          var labels = result.labels.map(i => {
            i.metric = i.count
            i.name = i.label
            i.utm = utm
            return i
          })
          return {trend, labels}
        }
      },
      async getViewTime () {
        var that = this
        var viewTimes = await operation()
        return viewTimes
        async function operation () {
          var query = {
            pageId: that.pageKey,
            timePeriod: that.form.timeRange.map(t => t.getTime && t.getTime() || 0),
            interval: that.form.step,
            appId: 'tview'
          }
          var result = await Server({
            url: 'statistics/getViewTime',
            method: 'post',
            data: query
          }).then(({data}) => {
            return data.data || {}
          }).catch((e) => {
            console.error(e)
            return { list: [], avarage: 0 }
          })
          that.sumData['viewTimes'] = result.avarage
          return {trend: result.list, avarage: result.avarage}
        }
      },
      actionSelect (row) {
        this.selectedAction = row
        this.selectedActionLabel = ''
        this.setCurrent('actiontable', row)
      },
      actionLabelSelect (row) {
        this.selectedActionLabel = row
        this.setCurrent('labeltable', row)
      },
      setCurrent (table, row) {
        this.$refs[table].setCurrentRow(row)
      },
      utmTrend (trend = [], utms = [], metrics = ['pv', 'uv']) {
        // 对齐数据
        trend = [].concat(...trend).reduce((o, item) => {
          var key = item.date
          if (!o[key]) o[key] = {}
          o[key]['dateStr'] = new Date(key).Format('yyyy-MM-dd hh:mm:ss')
          o[key][item.utm] = item
          return o
        }, {})
        // 时间升序 并 按指标聚合数据
        trend = Object.keys(trend).sort((a, b) => a <= b ? -1 : 1).reduce((o, key) => {
          var item = trend[key]
          if (!o.x) o.x = []
          o.x.push(item.dateStr)
          utms.map(utm => {
            ;metrics.map(m => {
              var key = `${utm}|${m}`
              if (!o[key]) o[key] = []
              o[key].push(item[utm] && item[utm][m] || 0)
            })
          })
          return o
        }, {})
        return trend
      },
      utmTable (table, utms) {
        // 对齐数据
        table = [].concat(...table).reduce((o, item) => {
          if (!o[item.name]) {
            o[item.name] = { name: item.name }
          }
          o[item.name][item.utm] = item.metric
          return o
        }, {})
        // 生成表格
        table = Object.values(table)
        return table
      }
    },
    destroyed () {
      this.tongjiPageId = null
    }
  }
</script>
