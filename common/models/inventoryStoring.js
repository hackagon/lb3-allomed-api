const _ = require('lodash');
const app = require('../../server/server')

module.exports = (ModelInventoryStoring) => {
  ModelInventoryStoring.observe("before save", async ctx => {

  })
}