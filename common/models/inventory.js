const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");
const moment = require('moment');

module.exports = (ModelInventory) => {

  /**
   * @todo    add inventoryLine 
   */
  ModelInventory.observe("after save", async ctx => {
    const ModelInventoryLine = app.models.InventoryLine

    const inventoryId = _.get(ctx, "instance.__data.id")
    const inventoryLines = _.get(ctx, "options.req.body.inventoryLines", []);

    if (ctx.isNewInstance) {
      // POST /inventories
      await Promise.map(inventoryLines, inventoryLine => {
        _.set(inventoryLine, "inventoryId", inventoryId);
        return ModelInventoryLine.create(inventoryLine);
      })

    } else {
      // PUT /inventories
      await Promise.each(inventoryLines, inventoryLine => {
        return ModelInventoryLine.findById(inventoryLine.id)
          .then(instance__inventoryLine => {
            instance__inventoryLine.__data = {
              ...instance__inventoryLine.__data,
              ...inventoryLine
            }
            return instance__inventoryLine.save()
          })
      })
    }
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
    const inventoryLines = await instance__inventory.inventoryLines.find();

    await Promise.each(inventoryLines, inventoryLine => {
      return Promise.all([
        inventoryLine.product.get(),
        inventoryLine.conversion.get()
      ])
        .then(res => {
          inventoryLine.__data.productName = res[0].__data.productName;
          inventoryLine.__data.conversionName = res[1].__data.conversionName;
          return inventoryLine;
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
   * @todo    delete inventory including inventoryLines
   */

  ModelInventory.observe("after delete", async ctx => {
    const ModelInventoryLine = app.models.InventoryLine
    const inventoryId = _.get(ctx, "where.id", "");
    await ModelInventoryLine.destroyAll({ where: { inventoryId } })
  })
}