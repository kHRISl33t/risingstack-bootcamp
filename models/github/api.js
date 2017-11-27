'use strict'

const request = require('request-promise-native')

const API_URL = 'https://api.github.com'
const USER_AGENT = 'RisingStack-Bootcamp'

function searchRepositories(query = {}) {
  return request({
    method: 'GET',
    uri: `${API_URL}/search/repositories`,
    headers: {
      Authorization: 'token 09c63e52a3ea8a28181f42cb76c59edfe9b8e6a9',
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': USER_AGENT
    },
    qs: query,
    json: true
  })
}

function getContributors(repository, query = {}) {
  return request({
    method: 'GET',
    uri: `${API_URL}/repos/${repository}/stats/contributors`,
    headers: {
      Authorization: 'token 09c63e52a3ea8a28181f42cb76c59edfe9b8e6a9',
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': USER_AGENT
    },
    qs: query,
    json: true
  })
}

module.exports = {
  searchRepositories,
  getContributors
}
