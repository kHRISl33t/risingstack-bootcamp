'use strict'

const joi = require('joi')
const fp = require('lodash/fp')
const _ = require('lodash')
const db = require('../db')
const User = require('../user')
const { addPrefix, getColumnsOfTable } = require('../db/helper')

const tableName = 'repository'

const insertSchema = joi.object({
  id: joi.number().required(),
  owner: joi.number().required(),
  full_name: joi.string().required(),
  description: joi.string().allow('').optional(),
  html_url: joi.string().uri().required(),
  language: joi.string().allow('').optional(),
  stargazers_count: joi.number().required()
}).required()

async function insert(params) {
  const validation = await joi.attempt(params, insertSchema)
  const insertIntoRepoTable = await db(tableName).insert(validation)
  return insertIntoRepoTable
}

const readSchema = joi.object().keys({
  id: joi.number().integer().optional(),
  full_name: joi.string().optional()
}).or('id', 'full_name').required()

async function read(params) {
  const validation = await joi.attempt(params, readSchema)

  const whereObj = {
    'repository.id': validation.id,
    'repository.full_name': validation.full_name
  }
  const condition = _.omitBy(whereObj, _.isUndefined)

  const prefixedSelection = await getColumnsOfTable(User.tableName)
    .then(addPrefix(User.tableName))

  /**
   * Array spread:
   * arr1 = [1] , arr2 = [2] arr3 = [...arr1, ...arr2]
   * -> arr3 = [1, 2]
   */
  const selectColumns = ['repository.*', ...prefixedSelection]

  const selectFromRepo = await db.select(selectColumns)
    .from(tableName)
    .leftJoin(User.tableName, `${User.tableName}.id`, `${tableName}.owner`)
    .where(condition)
    .first()
    // .toSQL()
  return selectFromRepo
}

module.exports = {
  tableName,
  insert,
  read
}
