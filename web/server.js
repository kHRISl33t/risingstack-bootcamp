'use strict'

const Koa = require('koa')
const logger = require('winston')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

router.get('/hello', (ctx, next) => {
  ctx.body = 'Hello Node.js!'
  next()
})

app.use(router.routes())

module.exports = app
