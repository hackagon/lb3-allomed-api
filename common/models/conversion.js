const _ = require('lodash');
const app = require('../../server/server')

module.exports = (Conversion) => {

  /**
   * @todo: filter fields
  */
  Conversion.afterRemote("findById", async ctx => {
    const instance__conversion = ctx.result;
    const ModelUnit = app.models.Unit;
    const instance__from_unit = await ModelUnit.findById(instance__conversion.__data.fromUnitId)
    const instance__to_unit = await ModelUnit.findById(instance__conversion.__data.toUnitId)

    ctx.result.__data.fromUnitName = instance__from_unit.__data.unitName
    ctx.result.__data.toUnitName = instance__to_unit.__data.unitName
  })
}