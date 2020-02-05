const _ = require('lodash');
const app = require('../../server/server')

module.exports = (InventoryLine) => {
  InventoryLine.observe("before save", async ctx => {
    const instance__inventory_line = ctx.instance;
    if (instance__inventory_line.__data.conversionId) {
      const instance__conversion = await instance__inventory_line.conversion.get()
      instance__inventory_line.__data.converseQuantity = instance__inventory_line.__data.invoiceQuantity * instance__conversion.__data.quantity
      instance__inventory_line.__data.converseUnitPrice = instance__inventory_line.__data.invoiceUnitPrice / instance__conversion.__data.quantity
    }
  })
}