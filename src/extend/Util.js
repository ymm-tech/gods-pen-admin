import Server from '../extend/Server'

function pipe () {
  var args = [].slice.call(arguments, 0)
  var val = args[ 0 ]
  for (let arg of args) {
    if (args.indexOf(arg) != 0 && typeof arg === 'function') val = arg(val)
  }
  return val
}

function baiduTongjiAjax (body) {
  return Server({
    url: 'statistics/baidu',
    method: 'post',
    data: body
  }).then(({data}) => {
    let {header, body} = data
    if (header && header.desc === 'success') {
      return body && body.data && body.data[0] && body.data[0].result
    } else {
      return null
    }
  })
}

function numberSplit (num) {
  return String(num).split('').reverse().map((a, i) => `${i % 3 === 2 ? ', ' : ''}${a}`).reverse().join('').replace(/^,/, '')
}

function combineTongjiData ({fields = [], items = []}, verbose = false) {
  if (verbose) {
    var [category, list] = items
    items = category.map((c, i) => [c[0], ...list[i]])
  }
  var obj = []
  for (let item of items) {
    obj.push(item.map((a, i) => [i, a]).reduce((a, b) => {
      var val = b[1] && b[1].val || b[1]
      var key = fields[b[0]]
      if (typeof val === 'number') {
        switch (key) {
          case 'pv_count':
          case 'visitor_count':
          case 'ip_count':
            val = numberSplit(val)
            break
          case 'bounce_ratio':
            val = val + '%'
            break
          case 'avg_visit_time':
            val = `${val / 60 | 0}分${val % 60}秒`
        }
      }
      a[key] = val
      return a
    }, {}))
  }
  return obj
}

function splitTrendData (result, pickedFields) {
  var sumData = result.sum && result.sum[0]
  var fields = result.fields.slice(1)
  var sumFields = fields.filter(f => f.indexOf('ratio') == -1)
  var items = result.items || []
  var x = items[0].map(x => x[0])
  var y = pickedFields
    .map(f => [f, fields.indexOf(f)])
    .reduce((o, [k, i]) => {
      o[k] = items[1].map(d => d[i])
      return o
    }, {})
  var sum = pickedFields
    .map(f => [f, sumFields.indexOf(f)])
    .reduce((o, [k, i]) => {
      o[k] = sumData[i]
      return o
    }, {})

  return {
    x,
    y,
    sum,
  }
}
function getBlobBydataURI (dataURI, type) {
  var binary = window.atob(dataURI.split(',')[1])
  var array = []
  for (let i = 0, leng = binary.length; i < leng; i++) {
    array.push(binary.charCodeAt(i))
  }
  let blob = new window.Blob([new Uint8Array(array)], {
    type: type
  })
  return blob
}
function readAsDataURL (file, callback) {
  const reader = new window.FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    callback && callback(this.result)
  }
}

export {
  readAsDataURL,
  getBlobBydataURI,
  splitTrendData,
  numberSplit,
  combineTongjiData,
  pipe,
  baiduTongjiAjax,
}

export default {
  readAsDataURL,
  getBlobBydataURI,
  splitTrendData,
  numberSplit,
  combineTongjiData,
  pipe,
  baiduTongjiAjax,
}
