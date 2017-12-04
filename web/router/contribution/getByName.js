'use strict'

const contribution = require('../../../models/contribution')
const joi = require('joi')
const middleware = require('../../middleware')
const compose = require('koa-compose')

const paramsSchema = joi.object({
  owner: joi.string().required(),
  name: joi.string().required()
}).required()

async function getByName(ctx) {
  const { owner, name } = ctx.params
  const result = await contribution.read({
    repository: {
      full_name: `${owner}/${name}`
    }
  })
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
  getByName
])
