'use strict'

const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const mongoose = require('mongoose')
const { User } = require('../../models/mongodb')

mongoose.Promise = Promise

chai.use(chaiHttp)

describe('/session', () => {
  const mongoUrl = process.env.mongouri
  let user

  const exampleUserObj = {
    username: 'exampleUser',
    email: 'example@example.com',
    password: 'password'
  }

  before(async () => {
    await mongoose.createConnection(mongoUrl)
    await mongoose.connection
      .then((res) => {
        console.log('connected')
        // console.log('connected')
      })
      .catch((err) => {
        console.log('err', err)
      })
    user = new User(exampleUserObj)
    await user.save()
  })

  after(async () => {
    await user.remove(exampleUserObj)
    await mongoose.connection.close()
  })

  it('should return with 401 when the user is not logged in', async () => {
    const agent = await chai.request.agent(server.listen())
    await agent
      .get('/session')
      .catch((err) => {
        expect(err.response).to.have.status(401)
        // console.log(err.response.status)
      })
  })

  it('should return with 200 when the user is logged and be able to view the secure page', async () => {
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
        // console.log(res.body)
        return agent.get('/session')
          .then((result) => {
            expect(result).to.have.status(200)
            // console.log(res.body)
          })
      })
  })
})
