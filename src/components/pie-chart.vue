<template>
  <div class="pie-chart-wrapper">
    <svg class="pie-chart" preserveAspectRatio='xMinYMin slice' viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g v-for="pie in pies" @click="selctePie(pie)">
        <path :d="pie.path" stroke="#fff" :fill="pie.fill" stroke-width="2" fill-opacity="0.75"/>
        <text text-anchor='middle' fill='#666' font-weight='bolder' font-size='16' :x='pie.text.x' :y='pie.text.y'>{{pie.percentage}}</text>
      </g>
    </svg>
    <div class="caption">
      <div class="caption-item" v-for="pie in pies">
        <span :style="{backgroundColor: pie.fill}"></span>
        &nbsp; {{pie.name === '__all__' ? '' : pie.name}} &nbsp; {{pie.percentage}}
      </div>
    </div>
    <div v-show="lists && lists.length" class="title">{{title}}</div>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus" scoped type="text/stylus">
  .pie-chart-wrapper {
    width: 100%
    height: 100%
    position relative
    svg {
      height 100%
    }
    .caption {
      position absolute
      right 0;
      top 0;
    }
    .caption-item {
      vertical-align 1px;
      font-size 12px;
      > span {
        vertical-align -3px;
        display inline-block
        width: 20px;
        height 14px;
      }
    }
    .title {
      position: absolute;
      top: -8px;
      left: 21px;
      font-size: 12px;
      color: #afafaf;
      font-weight: 100;
    }
  }
</style>

<script type="text/ecmascript-6">
  import BaseComponent from 'src/extend/BaseComponent'

  export default {
    mixins: [ BaseComponent ],
    name: 'pie-chart',
    data: function () {
      return {
      }
    },
    props: {
      title: String,
      lists: [Array, String],
      selected: [Object, String],
      colors: Object
    },
    computed: {
      cSelected () {
        return this.selected
      },
      pies () {
        if (!this.lists || !this.lists.length) return
        // eslint-disable-next-line
        var sum = this.lists.reduce((s, i) => (s += i.metric || 0, s), 0)
        if (!(sum > 0)) return
        var preSum = 0
        var endPoint, startPoint
        var delta = 150
        var pies = this.lists.reduce((o, i) => {
          var percentage = i.metric / sum
          startPoint = endPoint || {x: 1, y: 0}
          preSum += percentage
          if (preSum >= 0.99999 && this.lists.length == 1) preSum = 0.99999
          endPoint = {
            x: Math.cos(preSum * 2 * Math.PI),
            y: Math.sin(preSum * 2 * Math.PI),
            mx: Math.cos((preSum - percentage / 2)  * 2 * Math.PI),
            my: Math.sin((preSum - percentage / 2) * 2 * Math.PI),
          }
          var isSelected = this.selected === i
          var raduis = isSelected ? 140 : 130
          o.push({
            data: i,
            text: {
              x: endPoint.mx * raduis * 0.75 + delta,
              y: endPoint.my * raduis * 0.75 + delta
            },
            path: `M150 150 L ${startPoint.x * raduis + delta} ${startPoint.y * raduis + delta} A ${raduis} ${raduis} 0 ${percentage < 0.5 ? 0 : 1} 1 ${endPoint.x * raduis + delta} ${endPoint.y * raduis + delta} L 150 150`,
            metric: i.metric,
            fill: i.fill || this.colors[i.name],
            name: i.name,
            percentage: +(percentage * 100).toFixed(2) + '%'
          })
          return o
        }, [])
        return pies
      },
    },
    mounted: function () {
    },
    methods: {
      selctePie (pie) {
        this.$emit('selected', pie.data)
      }
    }
  }
</script>

