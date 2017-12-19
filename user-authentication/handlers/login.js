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

async function loginHandler(ctx) {
  const loginCredentials = ctx.request.body
  const { email, password } = loginCredentials

  try {
    await joi.attempt(loginCredentials, loginValidationSchema)
  } catch (err) {
    ctx.body = { message: 'Validation Error', err }
    // logger.error('/login Validation Error -', err)
  }

  logger.info('email', email, 'password', password)

  const user = new User({
    email,
    password
  })

  // first we try to find the user if exists
  const ifUserExists = await User.find({ email })

  // if userExists.length is bigger then 0, we found it
  // else its not exists or mistyped
  if (ifUserExists.length > 0) {
    /**
     * check for password matching
     * comparePassword needs the password of the user and email
     * because we need to check the password for the correct user
     */
    const check = await user.comparePasswords(password, email)
    // if user entered the correct password, then he/she is good to go
    if (check) {
      _.map(ifUserExists, (userData) => {
        ctx.session.username = userData.username
      })
      // ctx.session.username = loginValidation.email
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
}

module.exports = loginHandler
