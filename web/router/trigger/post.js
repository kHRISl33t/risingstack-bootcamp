'use strict'

const redis = require('../../../models/redis')
const joi = require('joi')
const middleware = require('../../middleware')
const compose = require('koa-compose')

const { CHANNELS } = redis

const bodySchema = joi.object({
  query: joi.string().required(),
}).required()

async function post(ctx) {
  const { query } = ctx.request.body
  const result = await redis.publishObject(CHANNELS.collect.trigger.v1, {
    query,
    date: new Date().toISOString()
  })

  if (!result) {
    ctx.status = 404
    return
  }
  ctx.status = 201
}

module.exports = compose([
  middleware.validator({
    body: bodySchema
  }),
  post
])
