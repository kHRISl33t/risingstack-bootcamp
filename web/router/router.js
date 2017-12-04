'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const middleware = require('../middleware')

const trigger = require('./trigger')
const repository = require('./repository')
const contribution = require('./contribution')

const router = new Router()

router
  .use(bodyParser())
  .use(middleware.queryParser({ allowDots: true }))

router.get('/hello', (ctx, next) => {
  ctx.body = 'Hello Node.js!'
  next()
})

/**
 * ctx.request, ctx.response
 * to test post:
 * curl -X POST -d query='RisingStack/risingstack-bootcamp' http://localhost:3000/api/v1/trigger
 */
router.post('/api/v1/trigger', trigger.post)
router.get('/api/v1/repository/:id', repository.getById)
router.get('/api/v1/repository/:id/contributions', contribution.getById)
router.get('/api/v1/repository/:owner/:name', repository.getByName)
router.get('/api/v1/repository/:owner/:name/contributions', contribution.getByName)

// router.get('/api/v1/repository/:owner/:name/contributions', async (ctx, next) => {
//   ctx.body = await contribution.getByName(ctx.params.owner, ctx.params.name)
//   next()
// })

module.exports = router
