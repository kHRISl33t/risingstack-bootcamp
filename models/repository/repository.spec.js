'use strict'

require('dotenv').config()
const { expect } = require('chai')
const db = require('../db')
const Repository = require('./repository')
const User = require('../user/user')
const helper = require('../db/helper')
const _ = require('lodash')

describe('Repository', () => {
  let id
  let userID

  let insertIntoRepository
  let insertIntoUser

  beforeEach(async () => {
    id = Math.floor(Math.random() * 100)
    userID = Math.floor(Math.random() * 100)

    insertIntoRepository = {
      id,
      owner: userID,
      full_name: 'something/js',
      description: 'some desc....',
      html_url: 'https://asd.com',
      language: 'javascript',
      stargazers_count: Math.floor(Math.random() * 100)
    }

    insertIntoUser = {
      id: userID,
      login: 'cheese',
      avatar_url: 'https://asd.com',
      html_url: 'https://asd.com',
      type: 'User'
    }

    await db(User.tableName).insert(insertIntoUser)
  })

  afterEach(async () => {
    await db(Repository.tableName).where({ id }).delete()
    await db(User.tableName).where({ id: userID }).delete()
  })

  describe('.insert', () => {
    it('should insert successfully', async () => {
      await Repository.insert(insertIntoRepository)
      const isInDb = await db(Repository.tableName).where({ id }).first()
      expect(isInDb).to.eql(insertIntoRepository)
    })

    it('should validate params', async () => {
      try {
        await Repository.insert(insertIntoRepository)
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
      }
    })
  })

  describe('.read', () => {
    it('should return a repository', async () => {
      await db(Repository.tableName)
        .insert(insertIntoRepository)

      const read = await Repository.read({ id: insertIntoRepository.id })
      const readFromUser = await User.read({ id: userID })

      const prefixedUser = helper.ObjectKeyRename(readFromUser, (key) => `user_${key}`)
      const mergedObj = Object.assign(insertIntoRepository, prefixedUser)

      expect(read).to.eql(mergedObj)
    })

    it('should validate params', async () => {
      try {
        await Repository.read({ id: insertIntoRepository.id })
      } catch (err) {
        expect(err.name).to.be.eql('ValidationError')
      }
    })
  })
})
