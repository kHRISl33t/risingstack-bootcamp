'use strict'

const repository = require('../../../models/repository')
const joi = require('joi')
const middleware = require('../../middleware')
const compose = require('koa-compose')

const paramsSchema = joi.object({
  owner: joi.string().required(),
  name: joi.string().required()
}).required()

async function getByName(ctx) {
  const { owner, name } = ctx.params
  const result = await repository.read({ full_name: `${owner}/${name}` })
  // !result because the returned result is an object
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
  getByName
])
