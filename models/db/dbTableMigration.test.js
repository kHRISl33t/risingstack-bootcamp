'use strict'

require('dotenv').config()
const { expect } = require('chai')
const knex = require('knex')
const config = require('./config')

const db = knex(config)

describe('user table up', () => {
  it('user table is in db', async () => {
    const hasUserTable = await db.schema.hasTable('user')
    return expect(hasUserTable).to.be.true
  })
})

describe('contribution table up', () => {
  it('user table is in db', async () => {
    const hasContributionTable = await db.schema.hasTable('contribution')
    return expect(hasContributionTable).to.be.true
  })
})

describe('repository table up', () => {
  it('user table is in db', async () => {
    const hasRepositoryTable = await db.schema.hasTable('repository')
    return expect(hasRepositoryTable).to.be.true
  })
})
