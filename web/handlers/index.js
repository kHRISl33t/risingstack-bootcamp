'use strict'

const registration = require('./registration')
const login = require('./login')
const logout = require('./logout')
const doihavesession = require('./doihavesession')

module.exports = {
  registration,
  login,
  logout,
  doihavesession
}
