const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");
const moment = require('moment');

module.exports = (ModelSalesSlip) => {
  ModelSalesSlip.observe("after save", async ctx => {
    const ModelSalesSlipLine = app.models.SalesSlipLine;

    const salesSlipId = _.get(ctx, "instance.__data.id");
    const salesSlipLines = _.get(ctx, "options.req.body.salesSlipLines", []);

    if (ctx.isNewInstance) {
      await Promise.map(salesSlipLines, salesSlipLine => {
        _.set(salesSlipLine, "salesSlipId", salesSlipId)
        return ModelSalesSlipLine.create(salesSlipLine)
      })
    }
  })
}