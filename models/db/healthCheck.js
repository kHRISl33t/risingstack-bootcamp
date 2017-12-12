'use strict'

const db = require('./index')
const config = require('./config')

async function healthCheck() {
  let status = 200
  // test to verify if the query fails, it will return with status code 500
  // await db.raw('SELECT pg_sleep(500); SELECT 1 FROM user').timeout(config.healthCheck.pg)
  //   .catch(function() { res = 500 })
  await db.select(1).timeout(config.healthCheck.pg)
    .catch(function() { status = 500 })

  return status
}

module.exports = {
  healthCheck
}
