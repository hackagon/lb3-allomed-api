const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");

module.exports = (Conversion) => {

  /**
   * @todo: filter fields
  */
  Conversion.afterRemote("findById", async ctx => {
    const ModelUnit = app.models.Unit;

    const instance__conversion = ctx.result;
    const instance__from_unit = await ModelUnit.findById(instance__conversion.__data.fromUnitId)
    const instance__to_unit = await ModelUnit.findById(instance__conversion.__data.toUnitId)

    ctx.result.__data.fromUnitName = instance__from_unit.__data.unitName
    ctx.result.__data.toUnitName = instance__to_unit.__data.unitName
  })

  Conversion.afterRemote("find", async ctx => {
    const ModelUnit = app.models.Unit;

    const instance__conversions = ctx.result;
    await Promise.map(instance__conversions, async inst => {
      const instance__from_unit = await ModelUnit.findById(inst.__data.fromUnitId)
      const instance__to_unit = await ModelUnit.findById(inst.__data.toUnitId)
      inst.__data.fromUnitName = instance__from_unit.__data.unitName
      inst.__data.toUnitName = instance__to_unit.__data.unitName
      return inst
    })
  })
}