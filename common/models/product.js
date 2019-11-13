const _ = require('lodash');
const app = require('../../server/server')

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

  Product.observe("after save", async (ctx) => {
    const product = ctx.instance;
    await product.activeIngredients.destroyAll();

    const activeIngredientIds = _.get(ctx, "options.req.body.activeIngredientIds", [])

    const ProductActiveIngredient = app.models.ProductActiveIngredient

    await activeIngredientIds.forEach(async (ingreId) => {
      await ProductActiveIngredient.create({
        productId: product.id,
        activeIngredientId: ingreId
      })
    })
  })
}