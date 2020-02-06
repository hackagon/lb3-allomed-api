const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");

module.exports = (ModelInventory) => {

  ModelInventory.observe("after save", async ctx => {
    const ModelInventoryLine = app.models.InventoryLine

    const inventoryId = _.get(ctx, "instance.__data.id")
    const inventoryLines = _.get(ctx, "options.req.body.inventoryLines", []);
    await Promise.map(inventoryLines, inventoryLine => {
      _.set(inventoryLine, "inventoryId", inventoryId);
      return ModelInventoryLine.create(inventoryLine);
    })
  })
}