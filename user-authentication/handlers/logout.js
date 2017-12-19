'use strict'

const logger = require('winston')

async function logout(ctx, next) {
  logger.info('/logout - user:', ctx.session.username, 'logged out.')
  logger.info('user')
  ctx.session = null
  ctx.body = { message: 'Logged out.' }
  await next()
}

module.exports = logout
