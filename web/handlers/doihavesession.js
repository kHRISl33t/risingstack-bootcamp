'use strict'

const logger = require('winston')

async function doIhaveSession(ctx) {
  if (ctx.session.username) {
    ctx.body = '12'
    logger.info('yee')
  } else {
    logger.info('nooo:(')
    ctx.body = '1'
  }
}

module.exports = doIhaveSession
