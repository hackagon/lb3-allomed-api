const _ = require('lodash');
const app = require('../../server/server')
const Promise = require('bluebird');
const utils = require("../../utils/fetchData");

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
      utils.getRelationInstanceField(instance_activeIngredient, "categories", "categoryName", "categoryNames"),
      utils.getRelationInstanceField(instance_activeIngredient, "therapies", "therapyName", "therapyNames"),
      utils.getRelationInstanceField(instance_activeIngredient, "supplyEnterprise", "enterpriseName"),
      utils.getRelationInstanceField(instance_activeIngredient, "produceEnterprise", "enterpriseName"),
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