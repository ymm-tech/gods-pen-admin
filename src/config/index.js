const defaultConfig = require('./default')

let config = Object.assign(defaultConfig, require('./' + (process.env.CODE_ENV || 'local')))

;['VIEW_PATH', 'ADMIN_PATH', 'EDITOR_PATH', 'API_PATH'].map(k => {
  if (config[k] === '/') return
  if (/^(https?:)?\/\//.test(config[k])) {
    config[k] = config[k].replace(/\/*$/, '/')
  } else {
    config[k] = config[k].replace(/^\/*|\/*$/g, '/')
  }
})

config.ADMIN_NAME = process.env.NODE_ENV === 'development' ? '' : (config.ADMIN_PATH.match(/([^/]+)\/?$/) || ['', 'admin'])[1]

config.enableGithub = config.github && config.github.clientId && config.github.clientSecret

module.exports = config
