'use strict'

const { expect } = require('chai')
const searchRepositories = require('./searchRepositories')
const nock = require('nock')

const githubApi = nock('https://api.github.com', {
  reqheaders: {
    'User-Agent': 'request-promise-native'
  }
})

describe('searchRepositories()', () => {
  it('should respond with a list from github', async () => {
    const searchRepos = githubApi
      .get('/search/repositories')
      .query({ q: 'language:javascript' })
      .reply(200, { repos: [] })
    const response = await searchRepositories({ q: 'language:javascript' })
    expect(response).to.be.eql({ repos: [] })
    expect(searchRepos.isDone()).to.be.eql(true)
  })
})
