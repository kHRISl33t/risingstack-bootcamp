'use strict'

const logger = require('winston')
const joi = require('joi')
const githubApi = require('../../models/github/api')
const _ = require('lodash')
const Repository = require('../../models/repository/repository')
const User = require('../../models/user/user')
const redis = require('../../models/redis')

const { CHANNELS } = redis

const messageSchema = joi.object({
  date: joi.date().raw(),
  query: joi.string(),
  page: joi.number().integer()
}).required().unknown()

/**
 * try {
 *  await User.insert(user)
 * } catch (err) {
 *  catch error heere
 * }
 * handle repository.insert in another trycatch
 */

async function insertUserAndRepository(user, repository) {
  await User.insert(user)
    .catch(() => logger.warn('REPOSITORY: Error while inserting a user'))
    .then(() => Repository.insert(repository))
    .then(() => logger.info('REPOSITORY: Successfully inserted a repository'))
    .catch(() => logger.warn('REPOSITORY: Repository might exists already'))
}

function redisPublish(date, repository) {
  redis.publishObject(CHANNELS.collect.contributions.v1, {
    date,
    repository: {
      id: repository.id,
      full_name: repository.full_name
    }
  })
}

async function onRepository(message) {
  logger.debug('repository: received', message)

  const validation = joi.attempt(message, messageSchema)

  let results = { user: {}, repository: {} }

  await githubApi.searchRepositories({
    q: validation.query,
    page: validation.page,
    per_page: '100'
  }).then((res) => {
    results = _.map(res.items, (element) => ({
      user: _.pick(element.owner, [
        'id', 'login', 'avatar_url', 'html_url', 'type'
      ]),
      repository: _.pick(element, [
        'id',
        'owner',
        'full_name',
        'description',
        'html_url',
        'language',
        'stargazers_count'
      ]),
    }))
  }).catch((err) => logger.warn('REPOSITORY: getContent', err))

  // console.log(results)

  results.forEach((element) => {
    element.repository.owner = element.repository.owner.id
    if (element.repository.language === null) element.repository.language = ''
    else if (element.repository.description === null) element.repository.description = ''
  })

  await Promise.all((_.map(results, async (item) => {
    await insertUserAndRepository(item.user, item.repository)
      .then(() => {
        logger.info('REPOSITORY: Successfully inserted a user and repository')
        redisPublish(validation.date, item.repository)
      })
      .catch(() => logger.warn('REPOSITORY: Error while inserting a user or repository'))
  })))
    .then(() => logger.info('REPOSITORY: onRepository() finished'))
    .catch((err) => logger.warn('REPOSITOY: Error in onRepository()', err))

  logger.debug('repository: finished', message)
}

module.exports = onRepository
