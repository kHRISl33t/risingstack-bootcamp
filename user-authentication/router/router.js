'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const logger = require('winston')
const handlers = require('../handlers')

const router = new Router()

router.use(bodyParser({
  multipart: true,
  urlencoded: true
}))

// hello
router.get('/hello', (ctx) => {
  ctx.body = 'ohai there'
})

// router.get('/login/:username/:password', (ctx) => {
// })

router.post('/login', handlers.login)
router.post('/registration', handlers.registration)
router.get('/logout', handlers.logout)
router.get('/doihavesession', handlers.doIhaveSession)

module.exports = router
