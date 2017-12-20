'use strict'

const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const request = require('super-request')
const server = require('../server')
const mongodb = require('../../models/mongodb')
const superRequest = require('supertest')

chai.use(chaiHttp)

const url = '/login'
describe('/login', () => {
  const userCreds = {
    email: 'user@user.us',
    password: 'user'
  }
  it('should return a user', async () => {
    // this.timeout(15000)
    const { body } = await request(server.listen())
      .post(url)
      .body(userCreds)
      .expect(200)
      .json(true)
      .end()

    expect(body).to.eql({ message: 'You are successfully logged in!' })
    // const agent = await chai.request.agent(server.listen())
    // await agent
    //   .post(url)
    //   .send(userCreds)
    //   .then((res) => {
    //     console.log('res123123123', res)
    //     expect(res).to.have.cookie('username')
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //     expect(err).to.have.status(404)
    //   })

    // agent.get('/')
    //   .then((res) => {
    //     console.log('123131231', res.body)
    //   })
    // const req = superRequest(server.listen())
    //   .post(url)
    //   .send(userCreds)
    //   .end()
    // console.log('req', req.cookies)
    // done()
    // this.timeout(10000)
    // await chai.request(server.listen())
    //   .post(url)
    //   .send(userCreds)
    //   .then((res) => {
    //     console.log('res', res)
    //   })
    //   .catch((err) => {
    //     console.log('err', err)
    //   })
  
    // const { body } = request(server.listen())
    //   .post(url)
    //   .body({
    //     email: 'user@user.us',
    //     password: 'user'
    //   })
    //   .end((err, res) => {
    //     console.log('err', err)
    //     console.log('res', res)
    //     // console.log('body', body)
    //   })

    // const login = request(server.listen())
    //   .post(url)
    //   .body({
    //     email: 'user@user.us',
    //     password: 'user'
    //   })
    //   .json(true)
    //   .end()
    // console.log(login)
  })
})
