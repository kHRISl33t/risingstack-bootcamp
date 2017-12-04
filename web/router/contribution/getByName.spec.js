'use strict'

const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const modelContribution = require('../../../models/contribution')

const server = require('../../server')

chai.use(chaiHttp)

const url = '/api/v1/repository/:owner/:name/contributions'
describe(`GET ${url}`, () => {
  const params = {
    owner: 'owner',
    name: 'name'
  }

  const fullName = `${params.owner}/${params.name}`

  it('should return with 200 when the repository exists with contributions', async function () {
    const lineCount = _.random(1000)

    this.sandbox.stub(modelContribution, 'read').resolves([{ line_count: lineCount }])

    await chai.request(server.listen())
      .get(url.replace(':owner', params.owner).replace(':name', params.name))
      .then((res) => {
        expect(res).to.have.status(200)
      })

    // await modelContribution.read(readObj)
    expect(modelContribution.read).to.be.calledWith({ repository: { full_name: fullName } })
  })

  it('should return 404 when the repository does not exists', async function () {
    this.sandbox.stub(modelContribution, 'read').resolves([])

    await chai.request(server.listen())
      .get(url.replace(':owner', params.owner).replace(':name', params.name))
      .catch((res) => expect(res).to.have.status(404))

    expect(modelContribution.read).to.have.been.calledWith({ repository: { full_name: fullName } })
  })
})
