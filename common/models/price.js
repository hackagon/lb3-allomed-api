const _ = require('lodash');
const app = require('../../server/server')

module.exports = (ModelPrice) => {
  ModelPrice.afterRemote("find", async ctx => {

  })

  ModelPrice.afterRemote("findById", async ctx => {

  })
}