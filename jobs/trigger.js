'use strict'

require('dotenv').config()
const { publisher, CHANNELS } = require('../models/redis')

const repoMessage = { date: new Date(), query: 'RisingStack/risingstack-bootcamp', page: 1 }
const contrMessage = { date: new Date(), repository: { id: 1863329, full_name: 'laravel/laravel' } }

publisher.publish(CHANNELS.collect.trigger.v1, JSON.stringify(repoMessage))
// publisher.publish(CHANNELS.collect.repository.v1, JSON.stringify(repoMessage))
// publisher.publish(CHANNELS.collect.contributions.v1, JSON.stringify(contrMessage))

