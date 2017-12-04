'use strict'

const repository = require('../../../models/repository')
const joi = require('joi')
const middleware = require('../../middleware')
const compose = require('koa-compose')

const paramsSchema = joi.object({
  id: joi.number().integer().required()
}).required()

async function getById(ctx) {
  const { id } = ctx.params
  const result = await repository.read({ id })
  if (!result) {
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
