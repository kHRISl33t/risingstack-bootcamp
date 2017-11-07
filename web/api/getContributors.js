'use strict'

const rpn = require('./request')

async function getContributors(repoFullName, query = {}) {
  const options = {
    uri: `repos/${repoFullName}/stats/contributors`,
    qs: query
  }

  let response

  try {
    response = await rpn(options)
    // response.forEach((key) => {
    //   console.log('User:', JSON.stringify(key.author.login))
    //   key.weeks.forEach((weeks) => {
    //     console.log('Start of week: ' + weeks.w +
    //     ' Number of adds: ' + weeks.a +
    //     ' Number of deletions: ' + weeks.d +
    //     ' Number of Commits: ' + weeks.c)
    //   })
    // })
    // console.log(response)
  } catch (err) {
    console.log(err)
  }
  
  return response
}

module.exports = getContributors
