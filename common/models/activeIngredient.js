const _ = require('lodash');
const app = require('../../server/server')

module.exports = (ActiveIngredient) => {

  /**
   * @todo: display some fields
  */
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

  /** 
   * @todo: get all properties of a specific activeIngredient including their categories and therapies
  */
  ActiveIngredient.afterRemote('findById', async (ctx) => {
    const activeIngredients = ctx.result;
    const res_categories = await activeIngredients.categories.find()
    const res_therapies = await activeIngredients.therapies.find()

    const categories = res_categories.map(item => ({ categoryId: item.id, categoryName: item.categoryName }))
    const therapies = res_therapies.map(item => ({ therapyId: item.id, therapyName: item.therapyName }))

    ctx.result = { ...activeIngredients.__data, categories, therapies }
  })

  /**
   * @todo: POST /api/ActiveIngredients --> save activeIngredient record and related record
   */
  ActiveIngredient.observe("after save", async (ctx) => {
    const activeIngredient = ctx.instance;
    await activeIngredient.categories.destroyAll();
    await activeIngredient.therapies.destroyAll();

    const categories = _.get(ctx, "options.req.body.categories")
    const therapies = _.get(ctx, "options.req.body.therapies")

    const ActiveIngredientCategory = app.models.ActiveIngredientCategory
    const ActiveIngredientTherapy = app.models.ActiveIngredientTherapy

    await categories.forEach(async (cate) => {
      await ActiveIngredientCategory.create({
        activeIngredientId: activeIngredient.id,
        categoryId: cate
      })
    })

    await therapies.forEach(async therapy => {
      await ActiveIngredientTherapy.create({
        activeIngredientId: activeIngredient.id,
        therapyId: therapy
      })
    })
  })
} 