'use strict'

const mongoose = require('mongoose')
const logger = require('winston')

const mongoUrl = process.env.mongouri

mongoose.connect(mongoUrl, {
  useMongoClient: true
})

mongoose.Promise = Promise

const db = mongoose.connection

db.on('error', (err) => {
  logger.error('Error in mongo', err)
})

module.exports = db
