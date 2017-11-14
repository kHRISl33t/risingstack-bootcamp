'use strict'

const db = require('../db')
const joi = require('joi')
const _ = require('lodash')
const fp = require('lodash/fp')
const User = require('../user/user')
const Repository = require('../repository/repository')
const helper = require('../db/helper')

const tableName = 'contribution'

const insertSchema = joi.object({
  repository: joi.number().required(),
  user: joi.number().required(),
  line_count: joi.number().required()
}).required()

async function insert(params) {
  const validation = await joi.attempt(params, insertSchema)
  const insertIntoContrTable = await db(tableName)
    .insert(validation)
    .returning('*')
  // console.log(insertIntoContrTable)
  return insertIntoContrTable[0]
}

const readSchema = joi.object().keys({
  user: joi.object().keys({
    id: joi.number().integer(),
    login: joi.string()
  }).xor('userid', 'login'),
  repository: joi.object().keys({
    id: joi.number().integer(),
    full_name: joi.string()
  }).xor('repoid', 'full_name')
}).or('user', 'repository').required()

async function read(params) {
  const { user = {}, repository = {} } = await joi.attempt(params, readSchema)

  const whereObj = {
    'user.id': user.id,
    'repository.id': repository.id
  }

  const condition = _.omitBy(whereObj, _.isUndefined)

  // prefix selection to select * columns from tables
  const [ColumnsOfUser, ColumnsOfRepository] = await Promise.all([
    helper.getColumnsOfTable(User.tableName)
      .then(helper.addPrefix(User.tableName)),
    helper.getColumnsOfTable(Repository.tableName)
      .then(helper.addPrefix(Repository.tableName))
  ])

  const selectAll = ['contribution.*', ...ColumnsOfUser, ...ColumnsOfRepository]

  const dbCall = await db.select(selectAll)
    .from(tableName)
    .leftJoin(`${Repository.tableName}`, 'contribution.repository', 'repository.id')
    .leftJoin(`${User.tableName}`, 'contribution.user', 'user.id')
    .where(condition)
    .first()

    /**
     * TODO:
     * √ return obj with like in the readme
     * √ test it
     * create fakedata for db to test it
     * db.seed knex seed
     */

  return helper.formatedResult(dbCall)
}

// read({ user: { id: 1, login: 'khris' }, repository: { id: 1, full_name: 'js' } })
// read({ repository: { id: 1, full_name: 'js' } })
// read({ user: { id: 1, login: 'khris' } })

async function insertOrReplace(params) {
  const validation = await joi.attempt(params, insertSchema)

  const insOrRep = await db.raw(`
  INSERT INTO ${tableName} 
    ("user", repository, line_count) 
  VALUES (${validation.user}, 
    ${validation.repository}, 
    ${validation.line_count}) 
  ON CONFLICT ("user", repository) 
  DO UPDATE SET line_count = ${validation.line_count}
  `)

  return insOrRep
}

module.exports = {
  tableName,
  insert,
  insertOrReplace,
  read
}
