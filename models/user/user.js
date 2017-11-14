'use strict'

const db = require('../db')
const joi = require('joi')

const tableName = 'user'

const insertSchema = joi.object({
  id: joi.number().required(),
  login: joi.string().required(),
  avatar_url: joi.string().uri().required(),
  html_url: joi.string().uri().required(),
  type: joi.string().uri().required()
}).required()

async function insert(params) {
  const validation = await joi.attempt(params, insertSchema)
  const insertIntoUserTable = await db(tableName).insert(validation)
  return insertIntoUserTable
}

// insert({ id: 6, login: 'cheese', avatar_url: 'https://asd.com', html_url: 'https://asd.com', type: 'https://asd.com' })
// insert({ id: 7, login: 'pepper', avatar_url: 'https://asd.com', html_url: 'https://asd.com', type: 'https://asd.com' })
// insert({ id: 8, login: 'salt', avatar_url: 'https://asd.com', html_url: 'https://asd.com', type: 'https://asd.com' })


const readSchema = joi.object().keys({
  id: joi.number().optional(),
  login: joi.string().optional()
}).xor('id', 'login').required()

async function read(params) {
  const validation = await joi.attempt(params, readSchema)
  const readUser = await db(tableName).where(validation).first()
  return readUser
}

// read({ id: 5 })

module.exports = {
  tableName,
  insert,
  read
}
