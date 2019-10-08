const _ = require('lodash');

module.exports = (ActiveIngredient) => {

  // Filter fields
  ActiveIngredient.afterRemote('find', async (ctx) => {
    var items = ctx.result;
    if (Array.isArray(items)) {
      ctx.result = items.map(item => ({
        id: item.id,
        activeIngredientCode: item.activeIngredientCode,
        activeIngredientName: item.activeIngredientName
      }))
    }
  })

  ActiveIngredient.afterRemote('findById', async (ctx) => {
    const activeIngredients = ctx.result;
    const res = await activeIngredients.categories.find()
    const categories = res.map(item => ({ categoryId: item.id, categoryName: item.categoryName }))
    ctx.result = {
      ...activeIngredients.__data,
      categories
    }
  })
} 