'use strict'

const contribution = require('../../../models/contribution')
const joi = require('joi')
const middleware = require('../../middleware')
const compose = require('koa-compose')

const paramsSchema = joi.object({
  id: joi.number().integer().required()
}).required()

async function getById(ctx) {
  const { id } = ctx.params
  const result = await contribution.read({ repository: { id } })
  // !result.length because the returned result is an array of objects
  if (!result.length) {
    ctx.status = 404
    return
  }
  ctx.body = result
}

module.exports = compose([
  middleware.validator({
    params: paramsSchema
  }),
  getById
])
