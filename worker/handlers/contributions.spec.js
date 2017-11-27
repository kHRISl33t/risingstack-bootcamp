'use strict'

require('dotenv').config()
const redis = require('../../models/redis')
const worker = require('../worker')
const githubApi = require('../../models/github/api')
const User = require('../../models/user')
const Contribution = require('../../models/contribution')
const handlers = require('./')
const _ = require('lodash')
const sinon = require('sinon')
const { expect } = require('chai')

const { CHANNELS } = redis

function countLines(array) {
  let additions = []
  let deletions = []

  // for in / for of
  for (const item of array) {
    additions.push(item.a)
    deletions.push(item.d)
  }

  additions = _.sum(additions)
  deletions = _.sum(deletions)

  let sum = additions - deletions
  if (sum < 0) sum = 0
  return sum
}

describe('Worker "contributions" channel', () => {
  // NOTE: this one is an integration test
  // it should check whether the handler is called
  // when a message is published to this channel, but the handler intself
  // should not be tested in
  let sandbox

  const getContributionsObj = {
    date: new Date().toISOString(),
    repository: {
      id: _.random(100),
      full_name: 'userName/repoName'
    },
    author: {
      id: _.random(100),
      login: 'loginName',
      avatar_url: 'avatar_url',
      html_url: 'html_url',
      type: 'UserType'
    },
    weeks: [
      {
        a: _.random(500, 1000),
        d: _.random(0, 499)
      },
      {
        a: _.random(500, 1000),
        d: _.random(0, 499)
      },
      {
        a: _.random(500, 1000),
        d: _.random(0, 499)
      }
    ]
  }

  beforeEach(() => { sandbox = sinon.sandbox.create() })
  afterEach(() => sandbox.restore())

  it(`should handle messages on the ${CHANNELS.collect.contributions.v1} channel`, async () => {
    const { date, repository } = getContributionsObj

    let resolveMyPromise

    const myPromise = new Promise(function(resolve) { resolveMyPromise = resolve })
    const contributionsStub = sandbox.stub(handlers, 'contributions').callsFake(() => {
      worker.halt()
      resolveMyPromise()
    })

    await worker.init()
    await redis.publishObject(CHANNELS.collect.contributions.v1, { date, repository })
    await myPromise

    expect(contributionsStub.callCount).to.eql(1)
    expect(contributionsStub).to.be.calledWith({ date, repository })
  })

  it('should fetch the contributions from GitHub & save them to the database', async () => {
    const insertContrObj = {
      line_count: countLines(getContributionsObj.weeks),
      repository: getContributionsObj.repository.id,
      user: getContributionsObj.author.id
    }

    const { author, weeks, date, repository } = getContributionsObj

    // sandbox.stub(githubApi, 'getContributors').resolves(author, weeks)
    sandbox.stub(githubApi, 'getContributors').resolves([{ author, weeks }])
    sandbox.stub(User, 'insert').resolves()
    sandbox.stub(Contribution, 'insertOrReplace').resolves()

    await handlers.contributions({
      date, repository
    })

    expect(githubApi.getContributors).to.be.calledWith(repository.full_name)
    expect(User.insert).to.be.calledWith(author)
    expect(Contribution.insertOrReplace).to.be.calledWith(insertContrObj)
  })
})
