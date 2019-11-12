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

  Product.observe("after save", async (ctx) => {
    const product = ctx.instance;
    await product.activeIngredients.destroyAll();

    const activeIngredients = _.get(ctx, "options.req.body.activeIngredients", [])

    const ProductActiveIngredient = app.models.ProductActiveIngredient

    await activeIngredients.forEach(async (ingre) => {
      await ProductActiveIngredient.create({
        productId: product.id,
        activeIngredientId: ingre
      })
    })
  })
}