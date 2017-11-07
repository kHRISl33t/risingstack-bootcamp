'use strict'

const rpn = require('request-promise-native')

const baseRequest = {
  baseUrl: 'https://api.github.com/',
  headers: {
    'User-Agent': 'request-promise-native'
  },
  json: true
}

module.exports = rpn.defaults(baseRequest)

