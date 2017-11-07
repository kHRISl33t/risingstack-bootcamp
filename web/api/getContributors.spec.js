'use strict'

const { expect } = require('chai')
const getContributors = require('./getContributors')
const nock = require('nock')

const githubApi = nock('https://api.github.com', {
  reqheaders: {
    'User-Agent': 'request-promise-native'
  }
})

describe('getContributors()', () => {
  it('should respond with contributors from github', async () => {
    const repoRequest = githubApi
      .get('/repos/RisingStack/RisingStack-bootcamp/stats/contributors')
      .reply(200, { contributors: [] })
    const response = await getContributors('RisingStack/RisingStack-bootcamp')
    expect(response).to.be.eql({ contributors: [] })
    expect(repoRequest.isDone()).to.be.eql(true)
  })
})
