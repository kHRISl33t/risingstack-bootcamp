'use strict'

const logger = require('winston')
const dbHealthCheck = require('../../../models/db/healthCheck')
const redisHealthCheck = require('../../../models/redis/healthCheck')
const _ = require('lodash')

let stateOfApp = false

process.on('SIGTERM', () => {
  stateOfApp = true
  // await healthCheck()
})

async function healthCheck(ctx) {
  /**
   * return 200 with JSON body { "status": "ok" }when everything is healthy,
   * 500 if any of the database or redis connections are not healthy and
   * 503 if the process got SIGTERM signal
   */

  const healthz = {
    error: false,
    statusOfProcesses: {
      postgres: 200,
      redis: 200
    }
  }

  if (stateOfApp) {
    ctx.status = 503
  }

  try {
    const status = await dbHealthCheck.healthCheck()
    logger.info(`Postgres status: ${status} -> Database is healthy`)
  } catch (err) {
    logger.error('Postgres error: Database timed out with query', err)
    healthz.statusOfProcesses.postgres = 500
  }

  try {
    const status = await redisHealthCheck.healthCheck()
    logger.info(`Redis status: ${status} -> connections are healthy`)
  } catch (err) {
    logger.error('Redis error: Some of the redis connections are not healthy: ', err)
    healthz.statusOfProcesses.redis = 500
  }

  _.forEach(healthz.statusOfProcesses, (statusCode) => {
    if (statusCode === 500) {
      healthz.error = true
    }
  })

  if (!healthz.error) {
    ctx.body = { status: 'OK' }
  } else {
    ctx.status = 500
    ctx.body = {
      status: 'NOT OK',
      state: healthz.statusOfProcesses
    }
  }
}

module.exports = healthCheck
