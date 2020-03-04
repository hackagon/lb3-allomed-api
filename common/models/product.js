const _ = require("lodash");
const app = require("../../server/server");
const Promise = require("bluebird");
const utils = require("../../utils/fetchData");

module.exports = Product => {
  /**
   * @todo: filter fields
   */
  Product.afterRemote("find", (ctx, instance__products, next) => {
    ctx.result = _.map(instance__products, item => ({
      id: item.id,
      productName: item.productName,
      retailPrice: item.retailPrice
    }));

    next()
  });

  Product.observe("after save", async ctx => {
    const product = ctx.instance;
    await product.activeIngredients.destroyAll();

    const activeIngredientIds = _.get(
      ctx,
      "options.req.body.activeIngredientIds",
      []
    );

    const ProductActiveIngredient = app.models.ProductActiveIngredient;

    await Promise.map(activeIngredientIds, ingreId => {
      return ProductActiveIngredient.create({
        productId: product.id,
        activeIngredientId: ingreId
      });
    });
  });

  Product.afterRemote("findById", async ctx => {
    const instance__product = ctx.result;
    await Promise.all([
      utils.getRelationInstanceField(instance__product, "activeIngredients", "activeIngredientName", "collection", "activeIngredientNames"),
      utils.getRelationInstanceField(instance__product, "route", "routeName", "item"),
      utils.getRelationInstanceField(instance__product, "categoryTrade", "categoryTradeName", "item"),
      utils.getRelationInstanceField(instance__product, "color", "colorName", "item"),
      utils.getRelationInstanceField(instance__product, "characteristic", "characteristicName", "item"),
      utils.getRelationInstanceField(instance__product, "package", "packageName", "item"),
      utils.getRelationInstanceField(instance__product, "distributionCountry", "countryName", "item"),
      utils.getRelationInstanceField(instance__product, "manufacturingCountry", "countryName", "item"),
      utils.getRelationInstanceField(instance__product, "distributionEnterprise", "enterpriseName", "item"),
      utils.getRelationInstanceField(instance__product, "manufacturingEnterprise", "enterpriseName", "item"),
      utils.getRelationInstanceField(instance__product, "labelEnterprise", "enterpriseName", "item"),
      utils.getRelationInstanceField(instance__product, "pharmacologicalMechanism", "pharmacologicalMechanismName", "item"),
      utils.getRelationInstanceField(instance__product, "pharmacologicalImpact", "pharmacologicalImpactName", "item"),
      utils.getRelationInstanceField(instance__product, "unit", "unitName", "item"),
      utils.getRelationInstanceField(instance__product, "toxicity", "toxicityName", "item"),
      utils.getRelationInstanceField(instance__product, "productGroup", "productGroupName", "item"),
      utils.getRelationInstanceField(instance__product, "odor", "odorName", "item"),
      utils.getRelationInstanceField(instance__product, "shape", "shapeName", "item"),
      utils.getRelationInstanceField(instance__product, "otherCharacteristic", "otherCharacteristicName", "item"),
      utils.getRelationInstanceField(instance__product, "categoryLabel", "categoryLabelName", "item"),
      utils.getRelationInstanceField(instance__product, "route", "routeName", "item"),
      utils.getRelationInstanceField(instance__product, "use", "useName", "item"),
      utils.getRelationInstanceField(instance__product, "chemicalStructure", "chemicalStructureName", "item"),
      utils.getRelationInstanceField(instance__product, "fdaPharmacologicalGroup", "fdaPharmacologicalGroupName", "item"),
      utils.getRelationInstanceField(instance__product, "snomedCategory", "snomedCategoryName", "item")
    ])
      .then(res => {
        res.forEach(e => {
          _.assign(instance__product.__data, e, {})
        })
      })
  })
};

