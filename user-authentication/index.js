'use strict'

const { promisify } = require('util')
const app = require('./server')
const config = require('./config')
const logger = require('winston')

const serverListen = promisify(app.listen).bind(app)

serverListen(config.port)
  .then(() => {
    logger.info(`Server is listening on port ${config.port}`)
  })
  .catch((err) => {
    logger.error('Error happend during server start', err)
    process.exit(1)
  })
