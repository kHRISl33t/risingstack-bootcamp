'use strict'

const joi = require('joi')
const logger = require('winston')
const { User } = require('../../models/mongodb')
const middleware = require('../middleware')
const compose = require('koa-compose')

const registrationSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required()
}).required()

async function registrationHandler(ctx, next) {
  const toValidate = ctx.request.body
  const { username, email, password } = toValidate

  try {
    await joi.attempt(toValidate, registrationSchema)
  } catch (err) {
    ctx.status = 400
    ctx.body = { message: 'Validation Error', err }
    logger.error('/registration Validation Error -', err)
  }

  const isEmailAlreadyExists = await User.find({ email })
  const isUsernameAlreadyExists = await User.find({ username })

  if (isEmailAlreadyExists.length > 0 || isUsernameAlreadyExists > 0) {
    logger.warn('Entered username or E-mail address already exists.')
    ctx.status = 400
    ctx.body = { message: 'Entered username or E-mail address already exists.' }
  } else {
    const user = new User({
      username,
      email,
      password
    })

    await user.save()

    ctx.status = 200
    ctx.body = { message: 'Successfully inserted a user.' }
    logger.info('Successfully created a new user')
  }
  await next()
}

module.exports = compose([
  middleware.validator({
    body: registrationSchema
  }),
  registrationHandler
])
