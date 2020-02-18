const _ = require('lodash');
const app = require('../../server/server')
const moment = require('moment');

module.exports = (ModelInventoryLine) => {
  /**
   * @todo    calculate converseQuantity, converseUnitPrice before save
   */
  ModelInventoryLine.observe("before save", async ctx => {
    const instance__inventory_line = ctx.instance;
    if (instance__inventory_line.__data.conversionId) {
      const instance__conversion = await instance__inventory_line.conversion.get()
      instance__inventory_line.__data.converseQuantity = instance__inventory_line.__data.invoiceQuantity * instance__conversion.__data.quantity
      instance__inventory_line.__data.converseUnitPrice = instance__inventory_line.__data.invoiceUnitPrice / instance__conversion.__data.quantity
    }
  })

  /**
   * @todo    create inventory Storing
   */
  ModelInventoryLine.observe("after save", async ctx => {
    const ModelInventoryStoring = app.models.InventoryStoring;

    const instance__inventory_line = ctx.instance;
    const instance__inventory = await instance__inventory_line.inventory.get();
    await ModelInventoryStoring.create({
      inventoryLineId: instance__inventory_line.__data.id,
      existingQuantity: 0,
      importQuantity: instance__inventory_line.__data.quantity,
      exportQuantity: 0,
      month: moment(instance__inventory.__data.inventoryDate).format("MM"),
      year: moment(instance__inventory.__data.inventoryDate).format("YYYY")
    })
  })
}