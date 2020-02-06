const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");

module.exports = (ModelInventory) => {

  /**
   * @todo    add inventoryLine 
   */
  ModelInventory.observe("after save", async ctx => {
    const ModelInventoryLine = app.models.InventoryLine

    const inventoryId = _.get(ctx, "instance.__data.id")
    const inventoryLines = _.get(ctx, "options.req.body.inventoryLines", []);
    await Promise.map(inventoryLines, inventoryLine => {
      _.set(inventoryLine, "inventoryId", inventoryId);
      return ModelInventoryLine.create(inventoryLine);
    })
  })

  /**
   * @todo    GET inventories/id including inventoryLines
   */
  ModelInventory.afterRemote("findById", async ctx => {
    const instance__inventory = ctx.result;
    const inventoryLines = await instance__inventory.inventoryLines.find();
    _.set(instance__inventory, "__data.inventoryLines", inventoryLines);
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