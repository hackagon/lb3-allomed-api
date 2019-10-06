const _ = require('lodash');

module.exports = (ActiveIngredient) => {

  // Filter fields
  ActiveIngredient.afterRemote('find', async (ctx) => {
    /**
    * @todo Filter fields for "find" remote method
    */
    var items = ctx.result;
    if (Array.isArray(items)) {
      ctx.result = items.map(item => ({
        activeIngredientCode: item.activeIngredientCode,
        activeIngredientName: item.activeIngredientName
      }))
    }
  })
}