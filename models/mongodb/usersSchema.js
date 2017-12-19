'use strict'

const logger = require('winston')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const _ = require('lodash')

mongoose.promise = global.Promise

const { Schema } = mongoose

const usersSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
})

usersSchema.pre('save', async function encrypt(next) {
  const user = this
  await bcrypt.hash(user.password, 10)
    .then((hash) => {
      logger.info('User password hashing...')
      user.password = hash
    })
    .catch((err) => {
      logger.error('Error with hashing:', err)
    })
  next()
})

usersSchema.methods.comparePasswords = async (userPassword, userEmail) => {
  let password
  let compareResult

  await User.find({ email: userEmail })
    .then((res) => {
      _.map(res, (userData) => {
        /* eslint-disable prefer-destructuring */
        password = userData.password
      })
    })

  await bcrypt.compare(userPassword, password)
    .then((res) => {
      compareResult = res
    })
  return compareResult
}

const User = mongoose.model('User', usersSchema)

module.exports = User
