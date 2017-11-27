'use strict'

const redis = require('../../models/redis')
const handlers = require('./')
const sinon = require('sinon')
const worker = require('../worker')
const { expect } = require('chai')
const _ = require('lodash')

const { CHANNELS } = redis

describe('Worker "trigger" channel', () => {
  // NOTE: this one is an integration test
  // it should check whether the handler is called when a message is published to this channel, but the handler intself
  // should not be tested in this
  let sandbox

  beforeEach(function() { sandbox = sinon.sandbox.create() })
  afterEach(() => sandbox.restore())

  it(`should handle messages on the ${CHANNELS.collect.trigger.v1} channel`, async () => {
    const triggerObject = {
      date: new Date().toISOString(),
      query: 'userName/repoName'
    }

    let resolveMyPromise

    const myPromise = new Promise(function(resolve) { resolveMyPromise = resolve })
    const triggerStub = sandbox.stub(handlers, 'trigger').callsFake(() => {
      worker.halt()
      resolveMyPromise()
    })

    await worker.init()
    await redis.publishObject(CHANNELS.collect.trigger.v1, triggerObject)
    await myPromise

    expect(triggerStub).to.be.calledWith(triggerObject)
  })

  it(`should send the messages to the ${CHANNELS.collect.repository.v1} channel`, async () => {
    const triggerRepo = {
      date: new Date().toISOString(),
      query: 'userName/repoName',
    }

    const { date, query } = triggerRepo

    sandbox.stub(redis, 'publishObject').resolves()

    await handlers.trigger(triggerRepo)

    expect(redis.publishObject.callCount).to.eql(10)
    await _.times(10, (page) => {
      expect(redis.publishObject).to.be.calledWith(CHANNELS.collect.repository.v1, {
        date, query, page
      })
    })
    // expect(redis.publishObject.callCount).to.eql(10)
  })
})
