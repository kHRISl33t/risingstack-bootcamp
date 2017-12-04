'use strict'

const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const modelContribution = require('../../../models/contribution')

const server = require('../../server')

chai.use(chaiHttp)

const url = '/api/v1/repository/:id/contributions'
describe(`GET ${url}`, () => {
  const id = _.random(1000)

  it('should return with 200 when the repo exists with contributions', async function () {
    const lineCount = _.random(100000)
    this.sandbox.stub(modelContribution, 'read').resolves([{ line_count: lineCount }])

    await chai.request(server.listen())
      .get(url.replace(':id', id))
      .then((res) => {
        // console.log(res.status)
        expect(res).to.have.status(200)
      })

    expect(modelContribution.read).to.be.calledWith({ repository: { id } })
  })

  it('should return with 400 when the repo doesnt exists', async function () {
    this.sandbox.stub(modelContribution, 'read').resolves([])

    await chai.request(server.listen())
      .get(url.replace(':id', id))
      .catch((res) => {
        // console.log('yaay it failed')
        expect(res).to.have.status(404)
      })

    expect(modelContribution.read).to.be.calledWith({ repository: { id } })
  })
})
