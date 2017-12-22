'use strict'

const { expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const mongoose = require('mongoose')
const { User } = require('../../models/mongodb')

mongoose.Promise = Promise

chai.use(chaiHttp)

const url = '/registration'
describe(`POST ${url}`, () => {
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

  it('should return with 200 after successfull registration', async function () {
    this.sandbox.stub(User.prototype, 'save').resolves()

    const agent = await chai.request.agent(server.listen())

    const fakeRegData = {
      username: 'example',
      email: 'example@example.hu',
      password: 'password'
    }

    await agent
      .post(url)
      .send(fakeRegData)
      .then((res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.eql({ message: 'Successfully inserted a user.' })
        // console.log(res.body)
      })
  })

  it('should return with 400 and not register when a field is missing', async function () {
    this.sandbox.stub(User.prototype, 'save').resolves()

    const agent = await chai.request.agent(server.listen())

    const fakeRegData = {
      email: 'example@example.hu',
      password: 'password'
    }

    await agent
      .post(url)
      .send(fakeRegData)
      .then((res) => {
        expect(res).to.have.status(400)
        console.log(res.body)
      })
      .catch((err) => {
        expect(err.response).to.have.status(400)
        expect(err.response.body).to.eql({ errors: { username: ['"username" is required'] } })
        // console.log(err.response.body)
      })
  })

  it('should return with 400 and not register when all fields are missing', async function () {
    this.sandbox.stub(User.prototype, 'save').resolves()

    const agent = await chai.request.agent(server.listen())

    await agent
      .post(url)
      .send({})
      .then((res) => {
        expect(res).to.have.status(400)
        console.log(res.body)
      })
      .catch((err) => {
        expect(err.response).to.have.status(400)
        expect(err.response.body).to.eql({ errors: { username: ['"username" is required'] } })
        // console.log(err.response.body)
      })
  })
})
