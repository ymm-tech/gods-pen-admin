function line ({title, seriesNames, x, y, log, unit, legend = true, legendAlign = 'right', tooltip = true, dataZoom = true, dataZoomLimit = 30},
 {seriesNames: seriesNames2, y: y2, log: log2, unit: unit2} = {}) {
  var xLength = x.length
  var option = {
    title: {
      text: title || '历史趋势',
      left: 'center',
      top: 10,
      textStyle: {
        color: '#666',
        fontWeight: '500'
      }
    },
    legend: legend && {
      orient: 'vertical',
      right: legendAlign == 'right' ? 10 : 'auto',
      left: legendAlign == 'left' ? 60 : 'auto',
      top: 30,
      data: [...seriesNames, ...(seriesNames2 || [])].map(name => {
        return {
          name: name,
        }
      })
    },
    grid: {
      left: 60,
      right: 60,
      top: 40,
      bottom: 40,
    },
    xAxis: {
      data: x,
      boundaryGap: seriesNames2 && seriesNames2.length > 0
    },
    yAxis: [
      {
        type: log ? 'log' : 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value} ' + (unit || '')
        }
      },
      seriesNames2 && seriesNames2.length && {
        type: log2 ? 'log' : 'value',
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value} ' + (unit2 || '')
        }
      }
    ],
    tooltip: tooltip && {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      textStyle: {
        fontSize: 12,
        fontWeight: 'lighter'
      }
    },
    dataZoom: dataZoom && [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: (1 - dataZoomLimit / xLength) * 100,
        end: 100
      }
    ],
    sampling: 'average',
    series: [
      ...y.map((s, i) => {
        return {
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            // color: 'rgba(0,0,0,0)',
            width: 1,
          },
          areaStyle: {
            // opacity: 0.8 - 0.1 * i
          },
          smooth: true,
          name: seriesNames[i],
          type: 'line',
          data: s,
        }
      }),
      ...(seriesNames2 && seriesNames2.length && y2.map((s, i) => {
        return {
          itemStyle: {
            opacity: 0.8
          },
          barMaxWidth: 30,
          yAxisIndex: 1,
          smooth: true,
          name: seriesNames2[i],
          type: 'bar',
          z: 20,
          data: s,
        }
      }) || [])
    ]
  }
  return option
}

export {
  line
}
