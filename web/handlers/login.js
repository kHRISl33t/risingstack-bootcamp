'use strict'

const joi = require('joi')
const logger = require('winston')
const _ = require('lodash')
const { User } = require('../../models/mongodb')

// validation schema for login
const loginValidationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
}).required()

async function loginHandler(ctx, next) {
  const loginCredentials = ctx.request.body
  const { email, password } = loginCredentials

  try {
    await joi.attempt(loginCredentials, loginValidationSchema)
  } catch (err) {
    ctx.body = { message: 'Validation Error', err }
  }

  const user = new User({
    email,
    password
  })

  const ifUserExists = await User.find({ email })

  if (ifUserExists.length > 0) {
    const check = await user.comparePasswords(password, email)

    if (check) {
      _.map(ifUserExists, (userData) => {
        ctx.session.username = userData.username
      })

      logger.info('/login - User:', ctx.session.username, 'just logged in')
      ctx.body = { message: 'You are successfully logged in!' }
    } else {
      ctx.body = { message: 'Bad password' }
      logger.warn('/login - Bad password')
    }
  } else {
    ctx.body = { message: 'Entered e-mail not exists.' }
    logger.warn('/login - Entered e-mail not exists.')
  }
  await next()
}

module.exports = loginHandler
