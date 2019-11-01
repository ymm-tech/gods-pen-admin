var findMenuByKey = function (data, key, path) {
  if (data && data.length) {
    for (var i = 0; i < data.length; i++) {
      var val = data[i]
      if (val.resKey == key) {
        return {
          path: path,
          value: val
        }
      } else {
        var res = findMenuByKey(val.child, key, path.concat([i]))
        if (res) {
          return res
        }
      }
    }
  }
}

export const updataTheme = ({
  commit
}, data) => {
  commit('updataTheme', data)
}

/**
 *
 * @param context
 */
export const initUserInfo = ({
  commit
}, data) => {
  commit('initUserInfo', data)
}
/**
 *
 * @param context
 */
export const initMenuData = ({
  commit
}, data) => {
  commit('initMenuData', data)
}

/**
 *
 * @param context
 */
export const changeActiveIndex = ({
  state,
  commit
}, data) => {
  var info = findMenuByKey(state.app.menuData, data, [])
  console.log('info', info)
  if (!info) {
    return
  }
  commit('changeNavIndex', info.path[0])
  commit('changeNavTwoIndex', info.path[1])
  setTimeout(function () {
    commit('changeActiveIndex', data)
  }, 100)
}

/**
 *
 * @param context
 */
export const changeNavIndex = ({
  commit
}, data) => {
  commit('changeNavIndex', data)
}

/**
 *
 * @param context
 */
export const changeNavTwoIndex = ({
  commit
}, data) => {
  commit('changeNavTwoIndex', data)
}

/**
 *
 * @param context
 */
export const changeAppSize = ({
  commit
}, data) => {
  commit('changeAppSize', data)
}

export const initAllCategory = ({
  commit
}, data) => {
  commit('initCategorys', data)
}
