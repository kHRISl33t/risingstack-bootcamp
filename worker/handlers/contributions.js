'use strict'

require('dotenv').config()
const logger = require('winston')
const joi = require('joi')
const githubApi = require('../../models/github/api')
const _ = require('lodash')
const User = require('../../models/user/user')
const Contribution = require('../../models/contribution/contribution')

const messageSchema = joi.object({
  date: joi.date(),
  repository: joi.object({
    id: joi.number().integer().required(),
    full_name: joi.string().required()
  }).required()
})

function countLines(array) {
  let additions = []
  let deletions = []

  // for in / for of
  for (const item of array) {
    additions.push(item.a)
    deletions.push(item.d)
  }

  additions = _.sum(additions)
  deletions = _.sum(deletions)

  let sum = additions - deletions
  if (sum < 0) sum = 0
  return sum
}

async function insertUserAndLineCount({ user, line_count, repository }) {
  await User.insert(user)
  await Contribution.insertOrReplace({
    line_count,
    repository,
    user: user.id
  })
}

async function onContributions(message) {
  logger.debug('contributions: received', message)

  const validation = await joi.attempt(message, messageSchema)

  const getContent = await githubApi.getContributors(validation.repository.full_name)

  const contributors = _.map(getContent, ({ author, weeks }) =>
    ({
      user: _.pick(author, ['id', 'login', 'avatar_url', 'html_url', 'type']),
      line_count: countLines(weeks)
    })
  )

  await Promise.all((_.map(contributors, async ({ user, line_count }) => {
    try {
      await insertUserAndLineCount({ user, line_count, repository: validation.repository.id })
      logger.info('CONTRIBUTIONS: User, repository inserted successfully')
    } catch (err) {
      logger.warn('CONTRIBUTIONS: User OR repository exists already.')
    }
  })))
    .then(() => logger.info('CONTRIBUTIONS: Successfully inserted'))
    .catch(() => logger.warn('CONTRIBUTIONS: Error'))

  logger.debug('contributions: finished', message)
}

module.exports = onContributions
