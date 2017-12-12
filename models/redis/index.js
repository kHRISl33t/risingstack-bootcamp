'use strict'

const Redis = require('ioredis')
const config = require('./config')

const CHANNELS = {
  collect: {
    trigger: {
      v1: 'bootcamp.collect.trigger.v1'
    },
    repository: {
      v1: 'bootcamp.collect.repository.v1'
    },
    contributions: {
      v1: 'bootcamp.collect.contributions.v1'
    }
  }
}

// if problem occurs then it might be lazyconnect
const publisher = new Redis(config.uri, { lazyConnect: true, dropBufferSupport: true, connectTimeout: 1000 })
const subscriber = new Redis(config.uri, { lazyConnect: true, dropBufferSupport: true, connectTimeout: 1000 })

function publishObject(channel, message) {
  return publisher.publish(channel, JSON.stringify(message))
}

async function destroy() {
  subscriber.disconnect()
  publisher.disconnect()
}

module.exports = Object.assign(subscriber, {
  subscriber,
  publisher,
  publishObject,
  destroy,
  CHANNELS
})
