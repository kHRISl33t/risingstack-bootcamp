'use strict'

async function doIhaveSession(ctx) {
  if (ctx.session.length > 0) {
    ctx.body = 'Yes, you have!'
  } else {
    ctx.body = 'No, you dont! :P'
  }
}

module.exports = doIhaveSession
