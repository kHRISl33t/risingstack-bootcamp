'use strict'

require('dotenv').config()
const { expect } = require('chai')
const db = require('../db')
const Contribution = require('./contribution')
const User = require('../user/user')
const Repository = require('../repository/repository')

describe('Contribution', () => {
  let userID
  let repoID

  let insertIntoContribution
  let insertIntoUser
  let insertIntoRepo

  beforeEach(async () => {
    userID = Math.floor(Math.random() * 100)
    repoID = Math.floor(Math.random() * 100)

    insertIntoContribution = {
      repository: repoID,
      user: userID,
      line_count: Math.floor(Math.random() * 1000)
    }

    insertIntoUser = {
      id: userID,
      login: 'cheese',
      avatar_url: 'https://asd.com',
      html_url: 'https://asd.com',
      type: 'https://asd.com'
    }

    insertIntoRepo = {
      id: repoID,
      owner: userID,
      full_name: 'something/js',
      description: 'some desc....',
      html_url: 'https://asd.com',
      language: 'javascript',
      stargazers_count: Math.floor(Math.random() * 100)
    }

    await db(User.tableName).insert(insertIntoUser)
    await db(Repository.tableName).insert(insertIntoRepo)
  })

  afterEach(async () => {
    await db(User.tableName).where({ id: userID }).delete()
    await db(Repository.tableName).where({ id: repoID }).delete()
  })

  describe('.insert', () => {
    it('should insert successfully', async () => {
      const test = await Contribution.insert(insertIntoContribution)
      await db(Contribution.tableName)
        .where({ repository: repoID, user: userID })
        .first()
      // console.log(contributionIsInDb)
      // console.log(insertIntoContribution)
      expect(test).to.eql(insertIntoContribution)
    })
  })

  describe('.insertOrReplace', () => {
    it('should insert or replace the contribution if it does not exists', async () => {
      await Contribution.insertOrReplace(insertIntoContribution)
      const contributionIsInDb = await db(Contribution.tableName)
        .where({ repository: repoID, user: userID })
        .first()
      expect(insertIntoContribution).to.eql(contributionIsInDb)
    })

    it('should replace content', async () => {
      await db(Contribution.tableName)
        .insert(insertIntoContribution)

      insertIntoContribution.line_count = Math.floor(Math.random() * 100)
      await Contribution.insertOrReplace(insertIntoContribution)
      const contributionInDB = await db(Contribution.tableName)
        .where({ repository: repoID, user: userID })
        .first()

      const expectedResult = {
        line_count: insertIntoContribution.line_count,
        user: userID,
        repository: repoID
      }
      expect(expectedResult).to.eql(contributionInDB)

      it('should validate insertOrReplace', async () => {
        try {
          await User.read({ user: insertIntoUser })
        } catch (err) {
          expect(err.name).to.be.eql('ValidationError')
          // expect(() => user.read({}).to.throw(string))
        }
      })
    })
  })

  describe('.read', () => {
    it('shoud read for contributors', async () => {
      await db(Contribution.tableName)
        .insert(insertIntoContribution)

      const expectedResult = {
        user: insertIntoUser,
        repository: insertIntoRepo,
        line_count: insertIntoContribution.line_count
      }

      let result = await Contribution.read({
        repository:
        { id: insertIntoRepo.id,
          full_name: insertIntoRepo.full_name
        }
      })
      expect(result).to.eql(expectedResult)

      result = await Contribution.read({
        user:
        { id: insertIntoUser.id,
          login: insertIntoUser.login
        }
      })
      expect(result).to.eql(expectedResult)

      result = await Contribution.read({
        user:
        { id: insertIntoUser.id,
          login: insertIntoUser.login
        },
        repository:
        { id: insertIntoRepo.id,
          full_name: insertIntoRepo.full_name
        }
      })
      // console.log(result)
      expect(result).to.eql(expectedResult)
    })
  })
})
