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
    } else {
      // PUT /salesSlips
      await Promise.each(salesSlipLines, salesSlipLine => {
        return ModelSalesSlipLine.findById(salesSlipLine.id)
          .then(instance__salesSlipLine => {
            instance__salesSlipLine.__data = {
              ...instance__salesSlipLine.__data,
              ...salesSlipLine
            }
            return instance__salesSlipLine.save()
          })
      })
    }
  })

  ModelSalesSlip.afterRemote("create", async ctx => {
    const instance__salesSlip = ctx.result;
    const salesSlipLines = await instance__salesSlip.salesSlipLines.find();
    _.set(instance__salesSlip, "__data.salesSlipLines", salesSlipLines)
  })

  ModelSalesSlip.afterRemote("replaceById", async ctx => {
    const instance__salesSlip = ctx.result;
    const salesSlipLines = await instance__salesSlip.salesSlipLines.find();
    _.set(instance__salesSlip, "__data.salesSlipLines", salesSlipLines)
  })

  ModelSalesSlip.afterRemote("findById", async ctx => {
    const instance__salesSlip = ctx.result;
    const salesSlipLines = await instance__salesSlip.salesSlipLines.find();

    await Promise.each(salesSlipLines, salesSlipLine => {
      return Promise.all([
        salesSlipLine.store.get(),
        salesSlipLine.product.get(),
        salesSlipLine.price.get(),
        salesSlipLine.unit.get(),
        salesSlipLine.conversion.get()
      ])
        .then(res => {
          const storeName = res[0] && res[0].__data.storeName;
          const productName = res[1] && res[1].__data.productName;
          const price = res[2] && res[2].__data.price;
          const unitName = res[3] && res[3].__data.unitName;
          const conversionName = res[4] && res[4].__data.conversionName;
          const subtotal = price * salesSlipLine.__data.quantity
          const discountRate = salesSlipLine.__data.discountRate
          const discountAmount = salesSlipLine.__data.discountAmount ? salesSlipLine.__data.discountAmount : subtotal * discountRate / 100
          const realSubtotal = subtotal - discountAmount;

          salesSlipLine.__data = {
            ...salesSlipLine.__data,
            storeName, productName, unitName, conversionName, subtotal, realSubtotal
          }
          return salesSlipLine
        })
    })
      .then(res => {
        _.set(instance__salesSlip, "__data.salesSlipLines", res)
      })
  })

  ModelSalesSlip.observe("after delete", async ctx => {
    const ModelSalesSlipLine = app.models.SalesSlipLine;
    const salesSlipLineId = _.get(ctx, "where.id", "");
    await ModelSalesSlipLine.destroyAll({
      where: {
        salesSlipLineId
      }
    });
  })
}