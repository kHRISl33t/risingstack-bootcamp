'use strict'

const logger = require('winston')
const joi = require('joi')
const _ = require('lodash')
const redis = require('../../models/redis')

const { CHANNELS } = redis


const messageSchema = joi.object({
  date: joi.date().raw(),
  query: joi.string()
}).required().unknown()

async function onTrigger(message) {
  logger.debug('trigger: received', message)

  const validation = joi.attempt(message, messageSchema)

  const { date, query } = validation

  await _.times(10, (page) => {
    redis.publishObject(CHANNELS.collect.repository.v1, {
      date, query, page
    })
  })
  // const page = 1
  // await redis.publishObject(CHANNELS.collect.repository.v1, {
  //   date, query, page
  // })

  logger.debug('trigger: finished', message)
}

module.exports = onTrigger
