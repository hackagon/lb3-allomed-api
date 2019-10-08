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

  // ActiveIngredient.afterRemote('findById', (ctx) => {
  //   const item = ctx.result;
  //   item.categories.find()
  //     .then(categories => {
  //       console.log(categories)
  //     })
  // })

  // ActiveIngredient.afterRemote('count', (ctx) => {
  //   console.log(ctx.result);
  // })
} 