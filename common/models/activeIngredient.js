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
    const activeIngredient = ctx.result;
    const res_categories = await activeIngredient.categories.find()
    const res_therapies = await activeIngredient.therapies.find()
    const res_supplierName = await activeIngredient.supplyEnterprise.get()
    const res_producerName = await activeIngredient.produceEnterprise.get();

    const categoryNames = res_categories.map(item => ({ categoryId: item.id, categoryName: item.categoryName }))
    const therapyNames = res_therapies.map(item => ({ therapyId: item.id, therapyName: item.therapyName }))
    const supplierName = res_supplierName && res_supplierName.__data.enterpriseName
    const producerName = res_producerName && res_producerName.__data.enterpriseName

    ctx.result = {
      ...activeIngredient.__data,
      categoryNames,
      therapyNames,
      supplierName,
      producerName
    }
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
      ActiveIngredientCategory.create({
        activeIngredientId: activeIngredient.id,
        categoryId: cate
      })
    })

    await Promise.map(therapyIds, therapy => {
      ActiveIngredientTherapy.create({
        activeIngredientId: activeIngredient.id,
        therapyId: therapy
      })
    })
  })
}