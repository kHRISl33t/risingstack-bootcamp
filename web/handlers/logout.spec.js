'use strict'

const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const mongoose = require('mongoose')
const { User } = require('../../models/mongodb')

mongoose.Promise = Promise

chai.use(chaiHttp)

const url = '/logout'
describe(`GET ${url}`, () => {
  let user

  const exampleUserObj = {
    username: 'exampleUser',
    email: 'example@example.com',
    password: 'password'
  }

  before(async () => {
    user = new User(exampleUserObj)
    await user.save()
  })

  after(async () => {
    await user.remove(exampleUserObj)
  })

  it('should return with 200 and logout a logged in user', async () => {
    const { email, password } = exampleUserObj
    const agent = await chai.request.agent(server.listen())
    await agent
      .post('/login')
      .send({
        email,
        password
      })
      .then((res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.eql({ message: 'You are successfully logged in!' })

        return agent.get(url)
          .then((result) => {
            expect(result).to.have.status(200)
            expect(result.body).to.be.eql({ message: 'A user logged out. exampleUser' })
          })
      })
  })
})
