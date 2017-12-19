'use strict'

const Koa = require('koa')
const logger = require('winston')
const router = require('./router')
const http = require('http')
const views = require('koa-views')
const path = require('path')
const session = require('koa-session')

const app = new Koa()

app.keys = ['its a secret!!!']

app.use(session(app))

app.use(views(path.join(__dirname, '/views'), {
  map: {
    hbs: 'handlebars'
  }
}))

app.use(async (ctx, next) => {
  if (ctx.status === 404) {
    ctx.body = 'Page not exists'
  }
  await next()
})

app.use(router.routes())


app.on('error', (err) => {
  logger.error('Server error', { error: err.message })
})

module.exports = http.createServer(app.callback())
