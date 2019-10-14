const _ = require('lodash');

module.exports = (Product) => {

  /**
   * @todo: filter fields
  */
  Product.afterRemote('find', async (ctx) => {
    var items = ctx.result;
    if (Array.isArray(items)) {
      ctx.result = items.map(item => ({
        id: item.id,
        productName: item.productName,
        retailPrice: item.retailPrice
      }))
    }
  })
} 