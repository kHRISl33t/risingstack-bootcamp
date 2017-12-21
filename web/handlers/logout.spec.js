'use strict'

const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const mongoose = require('mongoose')
const { User } = require('../../models/mongodb')

mongoose.Promise = Promise

chai.use(chaiHttp)

describe('/logout', () => {
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
      .then(() => {
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

  it('should return with 200 and log out a logged in user', async () => {
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

        return agent.get('/logout')
          .then((result) => {
            expect(result).to.have.status(200)
            expect(result.body).to.be.eql({ message: 'A user logged out. exampleUser' })
          })
      })
  })
})
