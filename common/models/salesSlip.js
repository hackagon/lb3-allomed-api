const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");
const moment = require('moment');
const utils = require('../../utils/fetchData');

module.exports = (ModelSalesSlip) => {
  ModelSalesSlip.observe("after save", async ctx => {
    const ModelSalesSlipLine = app.models.SalesSlipLine;

    const salesSlipId = _.get(ctx, "instance.__data.id");
    const salesSlipLines = _.get(ctx, "options.req.body.salesSlipLines", []);
    const inventoryStoring = await ctx.instance.inventoryStoring.get();

    if (ctx.isNewInstance) {
      // POST /salesSlips => create salesSlipLines instance and update inventoryStoring instance
      await Promise.map(salesSlipLines, salesSlipLine => {
        _.set(salesSlipLine, "salesSlipId", salesSlipId)
        ModelSalesSlipLine.create(salesSlipLine)

        inventoryStoring.updateAttribute("exportQuantity", _.get(ctx, "instance.__data.quantity"))
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

  ModelSalesSlip.afterRemote("find", function (ctx, instance__salesSlipLines, next) {
    ctx.result = _.map(instance__salesSlipLines, item => ({
      id: item.id,
      saleCode: item.saleCode,
      saleType: item.saleType,
      customerName: item.customerName,
      patientName: item.patientName
    }))
    next()
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
        utils.getRelationInstanceField(salesSlipLine, "store", "storeName"),
        utils.getRelationInstanceField(salesSlipLine, "product", "productName"),
        utils.getRelationInstanceField(salesSlipLine, "price", "price", "item", "name"),
        utils.getRelationInstanceField(salesSlipLine, "unit", "unitName"),
        utils.getRelationInstanceField(salesSlipLine, "usingUnit", "usingUnitName"),
        utils.getRelationInstanceField(salesSlipLine, "conversion", "conversionName"),
      ])
        .then(res => {
          res.forEach(e => {
            _.assign(salesSlipLine.__data, e, {})
          })
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