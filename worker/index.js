'use strict'

const { promisify } = require('util')
const logger = require('winston')
const worker = require('./worker')
const http = require('http')
const redis = require('../models/redis')
const db = require('../models/db')
const config = require('./config')
const app = require('./server')

const serverListen = promisify(app.listen).bind(app)
const closeServerPromise = promisify(app.close).bind(app)

async function gracefulShutdown() {
  logger.info('Shutdown started...')

  const shutDownProcesses = Promise.all([closeServerPromise(), redis.destroy(), db.destroy()])

  try {
    await shutDownProcesses
    logger.info('Graceful shutdown finished successfully')
    process.exit(0)
  } catch (error) {
    logger.error('Error while performing graceful shutdown:', error)
    process.exit(1)
  }
}

worker.init()
  .then(() => {
    logger.info('Worker is running')
  })
  .catch((err) => {
    logger.error('Error happened during worker initialization', err)
    process.exit(1)
  })

serverListen(config.port)
  .then(() => logger.info(`Server is listening on port ${config.port}`))
  .catch((err) => {
    logger.error('Error happened during server start', err)
    process.exit(1)
  })

process.on('SIGTERM', () => {
  logger.info('Got SIGTERM on WORKER process. Graceful shutdown starts at', new Date().toISOString())
  gracefulShutdown()
})

