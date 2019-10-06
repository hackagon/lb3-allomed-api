const _ = require('lodash');

module.exports = (ActiveIngredient) => {
  // ActiveIngredient.observe('after save', (ctx, next) => {
  //   console.log(ctx.req)
  //   if (ctx.instance) {
  //     console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
  //     const { instance } = ctx;
  //     console.log("TCL: instance", instance)

  //   } else {
  //     console.log('Updated %s matching %j',
  //       ctx.Model.pluralModelName,
  //       ctx.where);
  //   }
  //   next();
  // })

  ActiveIngredient.afterRemote('*', async (ctx) => {
    const items = ctx.result;
    if (Array.isArray(ctx.result) && items[0].activeIngredientCode) {
      ctx.result = items.map(item => ({ activeIngredientCode: item.activeIngredientCode, activeIngredientName: item.activeIngredientName }))
    }
  })
}