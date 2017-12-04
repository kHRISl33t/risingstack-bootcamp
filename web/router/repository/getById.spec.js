'use strict'

const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const modelRepository = require('../../../models/repository')

const server = require('../../server')

chai.use(chaiHttp)

const url = '/api/v1/repository/:id'
describe(`GET ${url}`, () => {
  const id = _.random(1000)

  it('should return with 200 when the repository exists', async function () {
    this.sandbox.stub(modelRepository, 'read').resolves({ owner: 'asdf' })

    await chai.request(server.listen())
      .get(url.replace(':id', id))
      .then((res) => {
        // console.log(res.status)
        expect(res).to.have.status(200)
      })

    expect(modelRepository.read).to.be.calledWith({ id })
  })
  it('should return with 400 when the repository does not exists', async function () {
    this.sandbox.stub(modelRepository, 'read').resolves()

    await chai.request(server.listen())
      .get(url.replace(':id', id))
      .catch((err) => {
        expect(err).to.have.status(404)
        // console.log(err.status)
      })

    expect(modelRepository.read).to.be.calledWith({ id })
  })
})
