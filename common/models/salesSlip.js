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
      // POST /salesSlips
      await Promise.map(salesSlipLines, salesSlipLine => {
        _.set(salesSlipLine, "salesSlipId", salesSlipId)
        return ModelSalesSlipLine.create(salesSlipLine)
      })
    }
  })

  ModelSalesSlip.afterRemote("create", async ctx => {
    const instance__salesSlip = ctx.result;
    const salesSlipLines = await instance__salesSlip.salesSlipLines.find();
    _.set(instance__salesSlip, "__data.salesSlipLines", salesSlipLines)
  })

  ModelSalesSlip.afterRemote("findById", async ctx => {
    const instance__salesSlip = ctx.result;
    const salesSlipLines = await instance__salesSlip.salesSlipLines.find();

    await Promise.each(salesSlipLines, salesSlipLine => {
      return Promise.all([
        salesSlipLine.product.get(),

      ])
        .then(res => {

        })
    })
      .then(res => {
        _.set(instance__salesSlip, "__data.salesSlipLines", res)
      })
  })

  ModelSalesSlip.observe("after delete", async ctx => {

  })
}