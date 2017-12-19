'use strict'

const joi = require('joi')
const logger = require('winston')
const { User } = require('../../models/mongodb')

const registrationSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required()
}).required()

async function registration(ctx) {
  const toValidate = ctx.request.body
  const { username, email, password } = toValidate

  try {
    await joi.attempt(toValidate, registrationSchema)
  } catch (err) {
    logger.error('/registration Validation Error -', err)
    // ctx.body = { message: 'Validation Error' }
  }

  // logger.info(username, email, password)
  // checking if username/email is already in db
  const isEmailAlreadyExists = await User.find({ email })
  const isUsernameAlreadyExists = await User.find({ username })

  // if returned object length > 0 then there is a user with the same username/email
  // else we can insert it, since theres no user like before!
  if (isEmailAlreadyExists.length > 0 || isUsernameAlreadyExists > 0) {
    // logger.warn('isEmail.length:', isEmailAlreadyExists.length)
    // logger.warn('isUsername.length', isUsernameAlreadyExists.length)
    logger.warn('Entered username or E-mail address already exists.')
    ctx.body = { message: 'Entered username or E-mail address already exists.' }
  } else {
    // creating a new user with valid input data
    const user = new User({
      username,
      email,
      password
    })
    // saving user to db
    await user.save()
    logger.info(user)
    ctx.body = { message: 'Successfully inserted a user.' }
    logger.info('Successfully created a new user')
  }
}

module.exports = registration
