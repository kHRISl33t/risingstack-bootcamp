'use strict'

const rpn = require('./request')

async function searchUsersWithFollowers(query = {}) {
  const options = {
    uri: 'search/users',
    qs: query
  }

  try {
    const response = await rpn(options)
    return response.total_count
  } catch (error) {
    console.log(error)
  }
}

module.exports = searchUsersWithFollowers

