'use strict'

const { promisify } = require('util')
const logger = require('winston')
const config = require('./config')
const server = require('./server')

const serverListen = promisify(server.listen).bind(server)

serverListen(config.PORT)
  .then(() => logger.info(`Server is listening on port !!! ${config.PORT}`))
  .catch((err) => {
    logger.error('Error happened during server start', err)
    process.exit(1)
  })
