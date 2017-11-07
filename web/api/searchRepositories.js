'use strict'

const rpn = require('./request')

async function searchRepositories(query = {}) {
  const options = {
    uri: 'search/repositories',
    qs: query
  }

  let response

  try {
    response = await rpn(options)
  } catch (err) {
    console.log(err)
  }

  return response
}

module.exports = searchRepositories
