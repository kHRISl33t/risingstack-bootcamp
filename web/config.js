'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  WEB_PORT: joi.number().integer().min(0).max(65535)
    .required()
}).unknown()
  .required()

const envVars = joi.attempt(process.env, envVarsSchema)

const config = {
  port: envVars.WEB_PORT
}

module.exports = config
