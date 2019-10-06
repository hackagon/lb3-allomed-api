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

  ActiveIngredient.afterRemote('prototype.__get__activeIngredients', async (ctx) => {
    console.log("after remote")
    const items = ctx.result;
    console.log(items)
  })
}