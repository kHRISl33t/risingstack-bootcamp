'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const healthz = require('./healthz')

const router = new Router()

router
  .use(bodyParser())

router.get('/hello', (ctx) => {
  ctx.body = 'Hello Node.js worker!'
})

router.get('/healthz', healthz.healthCheck)

module.exports = router
