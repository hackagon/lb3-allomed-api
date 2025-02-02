const _ = require('lodash');
const app = require('../../server/server')
const Promise = require('bluebird');
const utils = require("../../utils/fetchData");

module.exports = (ActiveIngredient) => {

  /**
   * @todo: filter fields
  */
  ActiveIngredient.afterRemote('find', (ctx, instance__activeIngredients, next) => {
    ctx.result = _.map(instance__activeIngredients, item => ({
      id: item.id,
      activeIngredientCode: item.activeIngredientCode,
      activeIngredientName: item.activeIngredientName
    }))

    next()
  })

  /** 
   * @todo: get all properties of a specific activeIngredient including their categories and therapies
  */
  ActiveIngredient.afterRemote('findById', async (ctx) => {
    const instance_activeIngredient = ctx.result;
    await Promise.all([
      utils.getRelationInstanceField(instance_activeIngredient, "categories", "categoryName", "collection", "categoryNames"),
      utils.getRelationInstanceField(instance_activeIngredient, "therapies", "therapyName", "collection", "therapyNames"),
      utils.getRelationInstanceField(instance_activeIngredient, "supplyEnterprise", "enterpriseName", "item", "supplierName"),
      utils.getRelationInstanceField(instance_activeIngredient, "produceEnterprise", "enterpriseName", "item", "producerName"),
    ])
      .then(res => {
        res.forEach(e => {
          _.assign(instance_activeIngredient.__data, e, {})
        })
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