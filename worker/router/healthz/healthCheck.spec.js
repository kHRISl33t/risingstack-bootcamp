'use strict'

require('dotenv').config()
const worker = require('../../index')
const { expect } = require('chai')
const chai = require('chai')
const httpChai = require('chai-http')
const server = require('../../server')
const dbHealthCheck = require('../../../models/db/healthCheck')
const db = require('../../../models/db')
const config = require('../../../models/db/config')
const redisHealthCheck = require('../../../models/redis/healthCheck')
const redis = require('../../../models/redis')
const { publisher, subscriber } = require('../../../models/redis')

chai.use(httpChai)

const url = '/healthz'

describe('Worker healthCheck', () => {
  it('should set status to 503 when received SIGTERM signal', async function () {
    // this.sandbox.stub(server, 'close').resolves()
    // this.sandbox.stub(db, 'destory').resolves()
    // this.sandbox.stub(redis, 'destroy').resolves()

    // const myRequest = chai.request(server.listen())
    //   .get(url)
    //   .then((res) => {
    //     console.log('res')
    //   })
    //   .catch((err) => {
    //     console.log(err.status)
    //     // console.log(err.status)
    //     console.log('err')
    //   })

    // process.kill(process.pid)
    // // process.
    // await myRequest
    // process.kill(process.pid)
    // process.kill, process.on, await request expect for 503
    // this.sandbox.stub(worker, 'close')
    // await chai.request(server.listen())
    //   .get(url)
    //   .then((res) => {
    //     console.log('res')
    //   })
    //   .catch((err) => {
    //     console.log('err')
    //   })
    // this.sandbox.stub()
  })

  it('should return with 500 when postgres is not healthy', async function () {
    let resolveMyPromise
    const myPromise = new Promise(function(resolve) {
      resolveMyPromise = resolve
    })

    this.sandbox.stub(dbHealthCheck, 'healthCheck').callsFake(async () => {
      resolveMyPromise()
      expect(async () => {
        await db.raw('SELECT pg_sleep(500); SELECT 1 FROM user').timeout(config.healthCheck.pg)
      }).to.throw()
    })

    await chai.request(server.listen())
      .get(url)
      .catch(async (err) => {
        // console.log(err.status)
        expect(err).to.have.status(500)
      })

    await myPromise

    expect(dbHealthCheck.healthCheck.callCount).to.eql(1)
  })

  it('should return with 200 when postgres is healthy', async function () {
    let resolveMyPromise
    const myPromise = new Promise(function(resolve) {
      resolveMyPromise = resolve
    })

    this.sandbox.stub(dbHealthCheck, 'healthCheck').callsFake(async () => {
      resolveMyPromise()
      expect(async () => {
        await db.raw('SELECT 1 FROM user').timeout(config.healthCheck.pg)
      }).to.not.throw()
    })

    await chai.request(server.listen())
      .get(url)
      .then((res) => {
        // console.log(res.status)
        expect(res).to.have.status(200)
      })

    await myPromise

    expect(dbHealthCheck.healthCheck.callCount).to.eql(1)
  })

  it('should return with 500 when redis is not healthy', async function () {
    const done = new Promise((resolve, reject) => {
      this.sandbox.stub(redisHealthCheck, 'healthCheck').callsFake(() => {
        expect(async () => {
          try {
            await publisher.ping()
            await subscriber.ping()
            await publisher.disconnect()
            await subscriber.disconnect()
            resolve()
          } catch (err) {
            console.log(err)
            reject(err)
          }
        }).to.throw('Error: Connection is closed.')
      })
    })

    await chai.request(server.listen())
      .get(url)
      .catch((err) => {
        // console.log('err', err.status)
        expect(err).to.have.status(500)
      })

    expect(redisHealthCheck.healthCheck.callCount).to.eql(1)
    return done
  })

  it('should return with 200 when redis is healthy', async function () {
    const done = new Promise((resolve, reject) => {
      this.sandbox.stub(redisHealthCheck, 'healthCheck').callsFake(() => {
        expect(async () => {
          try {
            await publisher.ping()
          } catch (err) {
            reject(err)
          }
        }).to.not.throw()
        resolve()
      })
    })

    await chai.request(server.listen())
      .get(url)
      .then((res) => {
        // console.log('res', res.status)
        expect(res).to.have.status(200)
      })

    expect(redisHealthCheck.healthCheck.callCount).to.eql(1)
    return done
  })
})
