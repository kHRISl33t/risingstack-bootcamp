'use strict'

const Koa = require('koa')
const logger = require('winston')
const router = require('./router')
const middleware = require('./middleware')

const app = new Koa()

// always on top
app.use(middleware.requestLogger())
app.use(router.routes())
app.use(router.allowedMethods())

app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

module.exports = app
