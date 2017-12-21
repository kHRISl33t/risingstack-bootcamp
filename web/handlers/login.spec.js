'use strict'

const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const mongoose = require('mongoose')
const { User } = require('../../models/mongodb')

mongoose.Promise = Promise

chai.use(chaiHttp)

describe('/login', () => {
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

  it('should return with 200 after successfull login', async () => {
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
      })
  })

  it('should return with 400 when e-mail is not exists', async () => {
    const agent = await chai.request.agent(server.listen())

    await agent
      .post('/login')
      .send({
        email: 'email@email.com',
        password: 'password'
      })
      .catch((err) => {
        expect(err.response.body).to.eql({ message: 'Entered e-mail not exists.' })
        expect(err.response).to.have.status(400)
        // console.log(err.response.status)
      })
  })

  it('should return with 400 when the fields are empty', async () => {
    const agent = await chai.request.agent(server.listen())

    await agent
      .post('/login')
      .send({})
      .catch((err) => {
        expect(err.response.body).to.eql({ errors: { email: ['"email" is required'] } })
        expect(err.response).to.have.status(400)
        // console.log(err.response.status)
      })
  })
})
