const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");
const moment = require('moment');
const createError = require('http-errors');

module.exports = (ModelInventory) => {

  /**
   * @todo    add inventoryLine 
   */
  ModelInventory.observe("after save", async ctx => {
    const ModelInventoryLine = app.models.InventoryLine
    const ModelConversion = app.models.Conversion;

    const inventoryId = _.get(ctx, "instance.__data.id")
    const inventoryLines = _.get(ctx, "options.req.body.inventoryLines", []);

    if (ctx.instance.status) return;

    if (!ctx.isNewInstance) {
      await ctx.instance.inventoryLines.destroyAll();
    }
    await Promise.each(inventoryLines, inventoryLine => {

      return ModelConversion.findById(inventoryLine.conversionId)
        .then(instance__conversion => {

          const converseQuantity = instance__conversion.__data.quantity * inventoryLine.invoiceQuantity;
          const converseUnitPrice = inventoryLine.invoiceUnitPrice / instance__conversion.__data.quantity
          const subtotalPrice = inventoryLine.invoiceQuantity * inventoryLine.invoiceUnitPrice;
          const discountAmount = inventoryLine.discountRate ? (subtotalPrice * inventoryLine.discountRate) / 100 : inventoryLine.discountAmount;

          _.set(inventoryLine, "inventoryId", inventoryId);
          _.set(inventoryLine, "converseQuantity", converseQuantity);
          _.set(inventoryLine, "converseUnitPrice", converseUnitPrice);
          _.set(inventoryLine, "discountAmount", discountAmount);

          return ModelInventoryLine.create(inventoryLine);
        })
    })
  })

  /**
   * @todo    sau khi nhân viên nhập kho, thủ kho tiến hành phê duyệt
   * @todo    when status = true (first time) ==> create inventoryStoring record
   */
  ModelInventory.observe("after save", async ctx => {
    const ModelInventoryStoring = app.models.InventoryStoring;
    const instance__inventory = ctx.instance;

    if (!instance__inventory.status) return;

    const instance__inventoryLines = await instance__inventory.inventoryLines.find();
    const inventoryLineIds = _.chain(instance__inventoryLines).map(m => m.id).value()
    const inventoryStoringIds = await ModelInventoryStoring.find({
      where: { inventoryId: inventoryLineIds },
      fields: { id: true }
    })
    if (!_.isEmpty(inventoryStoringIds)) throw createError(400, "This inventory is already approved")

    await Promise.map(instance__inventoryLines, instance__inventoryLine => {

      return ModelInventoryStoring.create({
        storeId: instance__inventory.__data.id,
        inventoryLineId: instance__inventoryLine.__data.id,
        productId: instance__inventoryLine.__data.productId,
        month: _.toNumber(moment().format("M")),
        year: _.toNumber(moment().format("Y")),
        exportQuantity: 0,
        existingQuantiy: 0,
        importQuantity: instance__inventoryLine.__data.converseQuantity
      })
    })
  })

  /**
   * @todo    GET inventories
   */
  ModelInventory.afterRemote("find", async ctx => {

    const instance__inventories = ctx.result;
    await Promise.map(instance__inventories, (instance__inventory, index) => {
      return Promise.all([
        instance__inventory.store.get(),
        instance__inventory.supplyEnterprise.get()
      ])
        .then(res => {
          instance__inventory.__data.inventoryDate = moment(instance__inventory.__data.inventoryDate).format("DD MMM YYYY")
          instance__inventory.__data.documentDate = moment(instance__inventory.__data.documentDate).format("DD MMM YYYY")
          instance__inventory.__data.storeName = res[0].__data.storeName;
          instance__inventory.__data.supplyEnterpriseName = res[1].__data.enterpriseName;
        })
    })
  })

  /**
   * @todo    GET inventories/id including inventoryLines
   */
  ModelInventory.afterRemote("findById", async ctx => {
    const instance__inventory = ctx.result;
    const instance__inventoryLines = await instance__inventory.inventoryLines.find();

    await Promise.each(instance__inventoryLines, instance__inventoryLine => {
      return Promise.all([
        instance__inventoryLine.product.get(),
        instance__inventoryLine.conversion.get()
      ])
        .then(([instance__product, instance__conversion]) => {
          instance__inventoryLine.__data.productName = instance__product && instance__product.__data.productName;
          instance__inventoryLine.__data.conversionName = instance__conversion && instance__conversion.__data.conversionName;

          const { invoiceQuantity, invoiceUnitPrice, discountAmount } = instance__inventoryLine
          const realSubtotal = invoiceQuantity * invoiceUnitPrice - discountAmount;

          _.set(instance__inventoryLine, "__data.productName", instance__product && instance__product.__data.productName)
          _.set(instance__inventoryLine, "__data.conversionName", instance__conversion && instance__conversion.__data.conversionName)
          _.set(instance__inventoryLine, "__data.realSubtotal", realSubtotal)

          return instance__inventoryLine;
        })
    })
      .then(res => {
        _.set(instance__inventory, "__data.inventoryLines", res);
      })
  })

  /**
   * @todo    reponse POST inventory including inventoryLines
   */
  ModelInventory.afterRemote("create", async ctx => {
    const instance__inventory = ctx.result;
    const inventoryLines = await instance__inventory.inventoryLines.find();
    _.set(instance__inventory, "__data.inventoryLines", inventoryLines);
  })

  /**
   * @todo    reponse PUT inventory including inventoryLines
   */
  ModelInventory.afterRemote("replaceById", async ctx => {
    const instance__inventory = ctx.result;
    const inventoryLines = await instance__inventory.inventoryLines.find();
    _.set(instance__inventory, "__data.inventoryLines", inventoryLines);
  })

  /**
   * @todo    delete inventory including inventoryLines + storingInventories
   */

  ModelInventory.observe("after delete", async ctx => {
    const ModelInventoryLine = app.models.InventoryLine
    const ModelInventoryStoring = app.models.InventoryStoring
    const inventoryId = _.get(ctx, "where.id", "");
    const instance__inventoryLines = await ModelInventoryLine.find({
      where: { inventoryId },
      fields: { id: true }
    })
    const inventoryLineIds = _.chain(instance__inventoryLines).map(m => m.__data.id).value()

    // destroy all inventory Lines
    await ModelInventoryLine.destroyAll({ inventoryId })

    // destroy all storing Inventories
    await ModelInventoryStoring.destroyAll({ inventoryLineId: { inq: inventoryLineIds } })
  })
}