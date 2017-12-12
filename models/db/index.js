'use strict'

const config = require('./config')
const knex = require('knex')

const db = knex(config)

// const envVar = process.env.PG_HEALTH_CHECK_TIMEOUT
// console.log(envVar)

module.exports = db
