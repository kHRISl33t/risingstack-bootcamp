'use strict'

const redis = require('../../models/redis')
const worker = require('../worker')
const githubApi = require('../../models/github/api')
const handlers = require('./')
const _ = require('lodash')
const sinon = require('sinon')
const { expect } = require('chai')

const { CHANNELS } = redis

describe('Worker "repository" channel', () => {
  // NOTE: this one is an integration test
  // it should check whether the handler is called when a message is published to this channel, but the handler intself
  // should not be tested in this
  let sandbox

  beforeEach(() => { sandbox = sinon.sandbox.create() })
  afterEach(() => sandbox.restore())

  it(`should handle messages on the ${CHANNELS.collect.repository.v1} channel`, async () => {
    const repositoryObject = {
      date: new Date().toISOString(),
      query: 'userName/repoName',
      page: _.random(10)
    }

    let resolveMyPromise

    const myPromise = new Promise(function(resolve) { resolveMyPromise = resolve })
    const repositoryStub = sandbox.stub(handlers, 'repository').callsFake(() => {
      worker.halt()
      resolveMyPromise()
    })

    await worker.init()
    await redis.publishObject(CHANNELS.collect.repository.v1, repositoryObject)
    await myPromise

    expect(repositoryStub).to.be.calledWith(repositoryObject)
  })

  it(`should fetch repositories from GitHub & send the messages to the ${CHANNELS.collect.contributions.v1} channel`, 
    async () => {
      const repoObj = {
        date: new Date().toISOString(),
        query: 'someUser/someRepo',
        page: _.random(10)
      }

      const { date, query, page } = repoObj

      const user = {
        id: _.random(1000),
        login: 'RisingStack',
        avatar_url: 'https://avatar.url/',
        html_url: 'https://html_url/',
        type: 'User' 
      }

      const repository = {
        id: _.random(1000),
        owner: user,
        full_name: 'RisingStack/bootcamp',
        description: 'desc',
        html_url: 'htmlurl',
        language: 'javascript',
        stargazers_count: _.random(1000)
      }

      sandbox.stub(githubApi, 'searchRepositories').resolves({
        items: [Object.assign({ user }, repository)]
      })
      sandbox.stub(redis, 'publishObject').resolves()

      await handlers.repository({ date, query, page })

      // checking if github repo can fetch the results
      expect(githubApi.searchRepositories).to.be.calledWith({
        q: query,
        page,
        per_page: '100'
      })

      // checking if redis can send messages to the contribution channel
      expect(redis.publishObject).to.be.calledWith(CHANNELS.collect.contributions.v1, {
        date,
        repository: {
          id: repository.id,
          full_name: repository.full_name
        }
      })
    })
})
