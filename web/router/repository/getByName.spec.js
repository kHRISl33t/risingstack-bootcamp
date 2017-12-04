'use strict'

const _ = require('lodash')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = require('chai')
const modelRepository = require('../../../models/repository')

const server = require('../../server')

chai.use(chaiHttp)

const url = '/api/v1/repository/:owner/:name'
describe(`GET ${url}`, () => {
  const params = {
    id: _.random(1000),
    owner: 'owner',
    name: 'repoName'
  }

  const { owner, name, id } = params
  const fullName = `${owner}/${name}`

  it('should return  with 200 when the repository exists', async function () {
    this.sandbox.stub(modelRepository, 'read').resolves({ id })

    await chai.request(server.listen())
      .get(url.replace(':owner', owner).replace(':name', name))
      .then((res) => {
        // console.log(res.status)
        expect(res).to.have.status(200)
      })

    expect(modelRepository.read).to.be.calledWith({ full_name: fullName })
  })

  it('should return with 404 when the repository doesnt exists', async function () {
    this.sandbox.stub(modelRepository, 'read').resolves()

    await chai.request(server.listen())
      .get(url.replace(':owner', params.owner).replace(':name', name))
      .catch((err) => {
        // console.log(err.status)
        expect(err).to.have.status(404)
      })

    expect(modelRepository.read).to.be.calledWith({ full_name: fullName })
  })
})
