'use strict'

const { publisher, subscriber } = require('./index')
const { promisify } = require('util')

const publisherOn = promisify(publisher.on).bind(publisher)
const subscriberOn = promisify(subscriber.on).bind(subscriber)

async function healthCheck() {
  let redisRunError = false

  // publisher.disconnect()

  if (!redisRunError) {
    const pingPromise = Promise.all([
      publisher.ping().timeout(500),
      subscriber.ping().timeout(500)
    ])

    try {
      await pingPromise
    } catch (error) {
      console.log('one of the redis connections ended')
      const pingResult = {
        publisher: publisher.status,
        subscriber: subscriber.status
      }
      throw pingResult
    }
    return 200
  }

  return 200
}

module.exports = {
  healthCheck
}
