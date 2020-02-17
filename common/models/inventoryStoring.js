const _ = require('lodash');
const app = require('../../server/server')

module.exports = (ModelMonthSummary) => {
  ModelMonthSummary.observe("before save", async ctx => {

  })
}