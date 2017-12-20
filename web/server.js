'use strict'

const Koa = require('koa')
const logger = require('winston')
const middleware = require('./middleware')
const router = require('./router')
const session = require('koa-session')

const app = new Koa()

app.keys = ['much secret, such secure app!']

app
  .use(session(app))
  .use(async (ctx, next) => {
    if (ctx.status === 404) {
      ctx.body = 'Requested page not exists'
    }
    await next()
  })
  .use(middleware.requestLogger())
  .use(router.routes())
  .use(router.allowedMethods())

app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

module.exports = app
