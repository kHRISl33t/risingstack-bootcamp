'use strict'

const logger = require('winston')

async function logoutHandler(ctx, next) {
  logger.info('/logout username:', ctx.session.username, 'logged out')
  ctx.body = { message: `A user logged out. ${ctx.session.username}` }
  ctx.session = null
  // ctx.body = { message: 'A user logged out.' }
  await next()
}

module.exports = logoutHandler
