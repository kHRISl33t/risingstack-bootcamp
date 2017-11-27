'use strict'

const joi = require('joi')
const logger = require('winston')

const envSchema = joi.object({
  TRIGGER_QUERY: joi.string().required()
}).required().unknown()

const env = joi.attempt(process.env, envSchema)

const args = process.argv.slice(2)
if (args.includes('--local') || args.includes('-L')) {
  process.env.REDIS_URI = 'redis://localhost:6379/0'
}

const query = env.TRIGGER_QUERY

const { publisher, CHANNELS } = require('../models/redis')

const repoMessage = { date: new Date(), query, page: 1 }
logger.info('Passed in query:', repoMessage)

publisher.publish(CHANNELS.collect.trigger.v1, JSON.stringify(repoMessage))
  .then(() => logger.info('Trigger sent.'))
  .catch((err) => logger.warn(err))
