'use strict'

require('dotenv').config()
const { expect } = require('chai')
const db = require('../db')
const User = require('./user')

// --watch
// describe.only() skip 
// it.only

describe('User', () => {
  let id
  let InsertToUser

  beforeEach(async () => {
    id = Math.floor(Math.random() * 100)
    InsertToUser = {
      id,
      login: 'cheese',
      avatar_url: 'https://asd.com',
      html_url: 'https://asd.com',
      type: 'https://asd.com' }
  })

  afterEach(async () => {
    await db(User.tableName).where({ id }).delete()
  })

  describe('.insert', () => {
    it('should insert successfully', async () => {
      await User.insert(InsertToUser)
      const isInDb = await db(User.tableName).where({ id }).first()
      expect(isInDb).to.eql(InsertToUser)
    })
    it('should validate', async () => {
      try {
        await User.insert(InsertToUser)
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
      }
    })
  })

  describe('.read', () => {
    it('should return user', async () => {
      const query = await db(User.tableName)
        .insert(InsertToUser)
      const readMethod = await User.read({ id: InsertToUser.id })

      expect(readMethod).to.eql(InsertToUser)
    })
    it('should check validation', async () => {
      try {
        await User.read({ id: InsertToUser.id })
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
        // expect(() => user.read({}).to.throw(string))
      }
    })
  })
})
