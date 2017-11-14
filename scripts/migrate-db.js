'use strict'

require('dotenv').config()
const config = require('../models/db/config')
const knex = require('knex')

const dbk = knex(config)

const args = process.argv.slice(2)
if (args.includes('--local') || args.includes('-L')) {
  const user = process.env.PG_USER || process.env.USER || 'root'
  const pw = process.env.PG_PASSWORD || ''
  const db = process.env.PG_DATABASE || 'risingstack_bootcamp'
  process.env.PG_URI = `postgres://${user}:${pw}@localhost:5432/${db}`
}

dbk.migrate.latest()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database synced successfully!')
    process.exit(0)
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  })
