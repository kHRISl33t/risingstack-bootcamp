'use strict'

const config = require('./config')
const knex = require('knex')

const db = knex(config)

// db.migrate.latest([config])

const user = require('./migrations/1-create-user')
const repository = require('./migrations/2-create-repository')
const contribution = require('./migrations/3-create-contribution')

// user table
async function userUp() {
  try {
    await user.up(db)
    console.log('user table created successfully')
  } catch (err) {
    console.log(err)
  }
}
async function userDown() {
  try {
    await user.down(db)
    console.log('user table deleted successfully')
  } catch (err) {
    console.log(err)
  }
}

// repotable
async function repoUp() {
  try {
    await repository.up(db)
    console.log('repo table created successfully')
  } catch (err) {
    console.log(err)
  }
}
async function repoDown() {
  try {
    await repository.down(db)
    console.log('repo table deleted successfully')
  } catch (err) {
    console.log(err)
  }
}

// contribution
async function contributionUp() {
  try {
    await contribution.up(db)
    console.log('contribution table created successfully')
  } catch (err) {
    console.log(err)
  }
}
async function contributionDown() {
  try {
    await contribution.down(db)
    console.log('contribution table deleted successfully')
  } catch (err) {
    console.log(err)
  }
}

// userDown()
// repoDown()
// contributionDown()

// userUp()
// repoUp()
// contributionUp()

// async function dbcall() { 
//   console.log('dbcall')
//   console.log(await db.select().table('user'))
// }

// dbcall()

module.exports = db
