const _ = require('lodash');
const app = require('../../server/server')
const Promise = require("bluebird");

module.exports = (ModelPrice) => {
  ModelPrice.afterRemote("find", async ctx => {
    const instance__prices = ctx.result;

    await Promise.map(instance__prices, instance__price => {
      return Promise.all([
        instance__price.product.get(),
        instance__price.conversion.get()
      ])
        .then(res => {
          _.set(instance__price, "__data.productName", res[0].__data.productName)
          _.set(instance__price, "__data.conversionName", res[1].__data.conversionName)
        })
    })
  })


  ModelPrice.afterRemote("findById", async ctx => {
    const instance__price = ctx.result;
    const instance__product = await instance__price.product.get();
    const instance__conversion = await instance__price.conversion.get();

    _.set(instance__price, "__data.productName", instance__product.__data.productName)
    _.set(instance__price, "__data.conversionName", instance__conversion.__data.conversionName)
  })
}