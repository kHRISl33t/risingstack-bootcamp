'use strict'

const { promisify } = require('util')
const logger = require('winston')
const config = require('./config')
const app = require('./server')
const http = require('http')
const redis = require('../models/redis')
const db = require('../models/db')

const httpServer = http.createServer(app.callback())

const serverListen = promisify(httpServer.listen).bind(httpServer)
const closeServerPromise = promisify(httpServer.close).bind(httpServer)

// curl http://localhost:3000/api/v1/repository/94214710 & kill pid
// kill pid

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

serverListen(config.port)
  .then(() => logger.info(`Server is listening on port ${config.port}`))
  .catch((err) => {
    logger.error('Error happened during server start', err)
    process.exit(1)
  })

process.on('SIGTERM', () => {
  logger.info('Got SIGTERM on WEB process. Graceful shutdown starts at', new Date().toISOString())
  gracefulShutdown()
})

// listen on the SIGTERM signal
// create a function called graceful shutdown
