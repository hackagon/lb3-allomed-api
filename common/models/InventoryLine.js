const _ = require('lodash');
const app = require('../../server/server')

module.exports = (ModelInventoryLine) => {
  ModelInventoryLine.observe("before save", async ctx => {
    const instance__inventory_line = ctx.instance;
    if (instance__inventory_line.__data.conversionId) {
      const instance__conversion = await instance__inventory_line.conversion.get()
      instance__inventory_line.__data.converse_quantity = instance__inventory_line.__data.invoice_quantity * instance__conversion.__data.quantity
    }
  })
}