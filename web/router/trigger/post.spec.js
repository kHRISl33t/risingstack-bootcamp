'use strict'

const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')

const redis = require('../../../models/redis')

const { CHANNELS } = redis

const server = require('../../server')

chai.use(chaiHttp)

const url = '/api/v1/trigger'
describe(`POST ${url}`, () => {
  it('should validate the body', async () => {
    await chai.request(server.listen())
      .post(url)
      .send({ })
      .catch((err) => {
        // console.log(err.response.body)
        expect(err).to.have.status(400)
        expect(err.response.body).to.eql({ errors: { query: ['"query" is required'] } })
      })
  })
  it('should return with 201 after successfull redis.publish', async function () {
    const date = new Date().toISOString()
    const query = { query: 'foo/bar' }

    // ...resolves() -> ...resolves({})
    this.sandbox.stub(redis, 'publishObject').resolves({})

    await chai.request(server.listen())
      .post(url)
      .send(query)
      .then((res) => {
        // console.log('201')
        expect(res).to.have.status(201)
      })

    await redis.publishObject(CHANNELS.collect.trigger.v1, {
      query,
      date
    })

    expect(redis.publishObject).to.be.calledWith(CHANNELS.collect.trigger.v1, {
      query,
      date
    })
  })
})
