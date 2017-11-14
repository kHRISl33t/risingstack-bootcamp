'use strict'

const fp = require('lodash/fp')
const _ = require('lodash')
const db = require('../db/index')

function getColumnsOfTable(tableName) {
  // let resultArray = []
  return db('information_schema.columns')
    .where({ table_name: tableName })
    .select('column_name')
    .options({ rowMode: 'array' })
    .then(_.map(_.first))
}

function addPrefix(tableName) {
  // _.map(['6', '8', '10'], parseInt);
  return fp.map((column) => `${tableName}.${column} as ${tableName}_${column}`)
}

function ObjectKeyRename(obj, fn) {
  const keys = Object.keys(obj)
  const result = {}

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i]
    const val = obj[key]
    const str = fn(key, val)
    if (typeof str === 'string' && str !== '') {
      key = str
    }
    result[key] = val
  }
  return result
}

function formatedResult(result) {
  const userObj = {}
  const repoObj = {}
  const contrObj = {}

  _.forEach(Object.keys(result), (key) => {
    if (key.startsWith('user_')) {
      userObj[key.substring(5)] = result[key]
    } else if (key.startsWith('repository_')) {
      repoObj[key.substring(11)] = result[key]
    } else {
      contrObj[key] = result[key]
    }
  })

  const fullObj = Object
    .assign(contrObj, { user: userObj }, { repository: repoObj })
  return fullObj
}

module.exports = {
  getColumnsOfTable,
  addPrefix,
  ObjectKeyRename,
  formatedResult
}
