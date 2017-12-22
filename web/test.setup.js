'use strict'

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const winston = require('winston')
const mongoose = require('mongoose')

chai.use(sinonChai)

// postgres
const user = process.env.PG_USER || process.env.USER || 'root'
const pw = process.env.PG_PASSWORD || ''
const db = process.env.PG_DATABASE || 'risingstack_bootcamp'
process.env.PG_URI = `postgres://${user}:${pw}@localhost:5432/${db}`

// mongodb
const mongo = process.env.mongouri || 'mongodb://localhost:27017/risingstack_bootcamp'
process.env.mongouri = mongo

// amqp
process.env.REDIS_URI = 'redis://localhost'

// logger
winston.setLevels({ test: 0, error: 1, warn: 2, info: 3, verbose: 4, debug: 5, silly: 6 })
winston.addColors({
  test: 'cyan', error: 'red', warn: 'yellow', info: 'cyan', verbose: 'cyan', debug: 'blue', silly: 'magenta'
})
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  level: process.env.LOGGER_LEVEL || 'test', colorize: true, prettyPrint: true
})

before(async () => {
  await mongoose.createConnection(mongo)
  await mongoose.connection
    .then(() => {
      // console.log('connected')
    })
    .catch((err) => {
      console.log('err', err)
    })
})

after(async () => {
  await mongoose.connection.close()
})

beforeEach(function beforeEach() {
  this.sandbox = sinon.sandbox.create()
})

afterEach(function afterEach() {
  this.sandbox.restore()
})
