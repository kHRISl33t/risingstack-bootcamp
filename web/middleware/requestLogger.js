'use strict'

const logger = require('winston')
const _ = require('lodash')

function createRequestLogger(options = {}) {
  let { level = 'silly' } = options
  return async function requestLogger(ctx, next) {
    /**
     * - method, original url of request
     * - request headers (expect auth and cookie)
     * - request duration in ms
     * - response headers and body (expect auth and cookie)
     * - response status code
     */
    const startTime = Date.now()

    const { method, originalUrl, header: requestHeader, body: requestBody } = ctx.request

    /**
     * time of calls:
     * TimerStart = newDate.now
     * await next
     * elapsed = (newDate.now - timerStart)
     * elapsed -> time to resolve a call
     */
    try {
      await next()
    } catch (err) {
      logger.error(`Error in: ${originalUrl}`)
      logger.error(`Error message: ${err}`)
    }

    const requestDuration = `${Date.now() - startTime} ms`

    const { header: responseHeader, body: responseBody, status } = ctx.response

    _.omit(requestHeader, ['authorization', 'cookie'])
    _.omit(responseHeader, ['authorization', 'cookie'])

    const requestLog = {
      method,
      originalUrl,
      Request: {
        requestHeader,
        requestBody
      },
      requestDuration,
      Response: {
        responseHeader, responseBody
      },
      status
    }

    // server error: >500 ERROR
    // client error: >400 WARN
    if (ctx.status >= 500) level = 'error'
    else if (ctx.status >= 400) level = 'warn'

    logger.log(level, `${method}: ${originalUrl}`, requestLog)
  }
}


module.exports = createRequestLogger
