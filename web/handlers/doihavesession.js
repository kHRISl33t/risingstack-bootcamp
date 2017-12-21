'use strict'

const logger = require('winston')

async function doIhaveSession(ctx) {
  if (ctx.session.username) {
    ctx.status = 200
    ctx.body = { message: `Welcome ${ctx.session.username}` }
    logger.info('you have session')
  } else {
    ctx.status = 401
    ctx.body = { message: 'Unauthorized acces - 401' }
  }
}

module.exports = doIhaveSession
