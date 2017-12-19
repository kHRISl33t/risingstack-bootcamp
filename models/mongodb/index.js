'use strict'

const User = require('./usersSchema')
const db = require('./mongo')

module.exports = {
  User,
  db
}
