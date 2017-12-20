'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const middleware = require('../middleware')
const healthz = require('./healthz')
const trigger = require('./trigger')
const repository = require('./repository')
const contribution = require('./contribution')
const handlers = require('../handlers')

const router = new Router()

router
  .use(bodyParser({
    multipart: true,
    urlencoded: true
  }))
  .use(middleware.queryParser({ allowDots: true }))

router.get('/hello', (ctx) => {
  ctx.body = 'Hello Node.js!'
})

router.post('/login', handlers.login)
router.post('/registration', handlers.registration)
router.post('/logout', handlers.logout)

router.get('/healthz', healthz.get)

router.post('/api/v1/trigger', trigger.post)
router.get('/api/v1/repository/:id', repository.getById)
router.get('/api/v1/repository/:id/contributions', contribution.getById)
router.get('/api/v1/repository/:owner/:name', repository.getByName)
router.get('/api/v1/repository/:owner/:name/contributions', contribution.getByName)

module.exports = router
