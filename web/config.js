'use strict'

const joi = require('joi')

// const envPortCheckSchema = joi.object({
//   PORT: joi.number().integer().required()
// }).unknown().required()

const Schema = joi.object({
  PORT: joi.number().required()
}).unknown().required()

const { error, value: envVars } = joi.validate(process.env, Schema)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  PORT: envVars.PORT
}

module.exports = config
