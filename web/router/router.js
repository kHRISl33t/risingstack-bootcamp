'use strict'

const Router = require('koa-router')
const searchRepositories = require('../api/searchRepositories')
const getContributors = require('../api/getContributors')
const searchUsersWithFollowers = require('../api/searchUsersWithFollowers')
const issuesWithComments = require('../api/issuesWithComments')

const router = new Router()

router.get('/hello', (ctx) => {
  ctx.body = 'Hello Node.js!'
})

router.get('/searchRepositories', async (ctx) => {
  ctx.body = await searchRepositories(ctx.query)
})

router.get('/getContributors/:repoUser/:repoName', async (ctx) => {
  ctx.body = await getContributors(ctx.params.repoUser + '/' + ctx.params.repoName, ctx.query)
})

router.get('/searchUsersWithFollowers', async (ctx) => {
  ctx.body = await searchUsersWithFollowers(ctx.query)
})

router.get('/issuesWithComments', async (ctx) => {
  ctx.body = await issuesWithComments(ctx.query)
})

module.exports = router
