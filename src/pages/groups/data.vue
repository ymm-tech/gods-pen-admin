<template>
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
                    <el-button type="primary" @click="getPUVTrendByES">查询</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-card>
                <div>
                  共计 {{sumData.projectCount}} 个项目， {{sumData.pageCount}} 个页面，累计访客 {{sumData.user}} 位
                </div>
              </el-card>
            </el-row>
            <el-row style="margin-top: 10px;">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
   .chart-hint {
    font-style: normal;
    font-size: 12px;
    color: #afafaf;
    font-weight: 100;
    margin-left: 7px;
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
  import Server from 'src/extend/Server'
  import {line} from 'src/extend/chartOptions'
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/line'

  export default{
    mixins: [ BasePage ],
    components: {chart: ECharts},
    name: 'group_data',
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
        sumData: {
          pv: null,
          uv: null,
          user: null,
          pageCount: null,
          projectCount: null
        },
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
          this.getPUVTrendByES()
        }
      },
      'form.step' () {
        this.getPUVTrendByES()
      },
    },
    props: {
      groupId: {
        type: [String, Number]
      }
    },
    mounted: function () {
    },
    computed: {
      trendOptions () {
        var x = this.trend.x
        if (!x) return {}
        return line(
          {
            title: '  ',
            dataZoom: false,
            seriesNames: ['PV', 'UV'],
            legendAlign: 'left',
            x,
            y: [this.trend.pv, this.trend.uv]
          }
        )
      },
      trendTable () {
        var trend = this.trend
        if (!trend || !trend.x || !trend.x.length) return null
        var theadkeys = Object.keys(trend).filter(k => k !== 'x')
        theadkeys.unshift('x')
        var thead = theadkeys.slice(0)
        thead[0] = '时间'
        var tbody = trend.x.map((x, index) => {
          return theadkeys.map(k => (trend[k] || [])[index] || 0)
        })
        tbody.push(theadkeys.map(k => k == 'x' ? '总计' : (this.sumData[k] || 0)))
        return {
          thead,
          tbody
        }
      }
    },
    methods: {
      async getPUVTrendByES () {
        var that = this
        var query = {
          groupId: +that.groupId,
          timePeriod: that.form.timeRange.map(t => t.getTime && t.getTime() || 0),
          interval: that.form.step,
        }
        var result = await Server({
          url: 'statistics/getGroupReport',
          method: 'post',
          data: query
        }).then(({data}) => {
          return data.data || {}
        }).catch((e) => {
          console.error(e)
          return { histogram: [] }
        })
        var trend = result.histogram.sort((a, b) => a.date > b.date ? 1 : -1).reduce((o, v) => {
          o.x.push(new Date(v.date).Format('yyyy-MM-dd hh:mm:ss'))
          o.pv.push(v.pv)
          o.uv.push(v.uv)
          return o
        }, {x: [], pv: [], uv: []})
        this.sumData['pv'] = result.sum.pv
        this.sumData['uv'] = result.sum.uv
        this.sumData['user'] = result.sum.user
        this.sumData['pageCount'] = result.pageCount
        this.sumData['projectCount'] = result.projectCount
        this.trend = trend
      }
    }
  }
</script>
