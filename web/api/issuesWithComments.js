'use strict'

const rpn = require('./request')

async function issuesWithComments(query = {}) {
  const options = {
    uri: 'search/issues',
    qs: query
  }

  try {
    const response = await rpn(options)
    return response.total_count
  } catch (err) {
    console.log(err)
  }
}

module.exports = issuesWithComments
