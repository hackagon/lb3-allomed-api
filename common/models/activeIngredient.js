const _ = require('lodash');
const app = require('../../server/server')
const Promise = require('bluebird');

module.exports = (ActiveIngredient) => {

  /**
   * @todo: filter fields
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
    const instance_activeIngredient = ctx.result;
    await Promise.all([
      instance_categories = instance_activeIngredient.categories.find(),
      instance_therapies = instance_activeIngredient.therapies.find(),
      instance_supplierName = instance_activeIngredient.supplyEnterprise.get(),
      instance_producerName = instance_activeIngredient.produceEnterprise.get()
    ])
      .then(res => {
        const categoryNames = res[0].map(item => ({ categoryId: item.id, categoryName: item.categoryName }))
        const therapyNames = res[1].map(item => ({ therapyId: item.id, therapyName: item.therapyName }))
        const supplierName = res[2] && res[2].__data.enterpriseName
        const producerName = res[3] && res[3].__data.enterpriseName

        ctx.result = {
          ...instance_activeIngredient.__data,
          categoryNames,
          therapyNames,
          supplierName,
          producerName
        }
      })
  })

  /**
   * @todo: POST /api/ActiveIngredients --> save activeIngredient record and related record
   */
  ActiveIngredient.observe("after save", async (ctx) => {
    const ActiveIngredientCategory = app.models.ActiveIngredientCategory
    const ActiveIngredientTherapy = app.models.ActiveIngredientTherapy

    const activeIngredient = ctx.instance;
    await activeIngredient.categories.destroyAll();
    await activeIngredient.therapies.destroyAll();

    const categoryIds = _.get(ctx, "options.req.body.categoryIds", [])
    const therapyIds = _.get(ctx, "options.req.body.therapyIds", [])


    await Promise.map(categoryIds, cate => {
      return ActiveIngredientCategory.create({
        activeIngredientId: activeIngredient.id,
        categoryId: cate
      })
    })

    await Promise.map(therapyIds, therapy => {
      return ActiveIngredientTherapy.create({
        activeIngredientId: activeIngredient.id,
        therapyId: therapy
      })
    })
  })
}