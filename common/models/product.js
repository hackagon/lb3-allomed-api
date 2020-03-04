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
      utils.getRelationInstanceField(instance__product, "route", "routeName"),
      utils.getRelationInstanceField(instance__product, "categoryTrade", "categoryTradeName"),
      utils.getRelationInstanceField(instance__product, "color", "colorName"),
      utils.getRelationInstanceField(instance__product, "characteristic", "characteristicName"),
      utils.getRelationInstanceField(instance__product, "package", "packageName"),
      utils.getRelationInstanceField(instance__product, "distributionCountry", "countryName"),
      utils.getRelationInstanceField(instance__product, "manufacturingCountry", "countryName"),
      utils.getRelationInstanceField(instance__product, "distributionEnterprise", "enterpriseName"),
      utils.getRelationInstanceField(instance__product, "manufacturingEnterprise", "enterpriseName"),
      utils.getRelationInstanceField(instance__product, "labelEnterprise", "enterpriseName"),
      utils.getRelationInstanceField(instance__product, "pharmacologicalMechanism", "pharmacologicalMechanismName"),
      utils.getRelationInstanceField(instance__product, "pharmacologicalImpact", "pharmacologicalImpactName"),
      utils.getRelationInstanceField(instance__product, "unit", "unitName"),
      utils.getRelationInstanceField(instance__product, "toxicity", "toxicityName"),
      utils.getRelationInstanceField(instance__product, "productGroup", "productGroupName"),
      utils.getRelationInstanceField(instance__product, "odor", "odorName"),
      utils.getRelationInstanceField(instance__product, "shape", "shapeName"),
      utils.getRelationInstanceField(instance__product, "otherCharacteristic", "otherCharacteristicName"),
      utils.getRelationInstanceField(instance__product, "categoryLabel", "categoryLabelName"),
      utils.getRelationInstanceField(instance__product, "route", "routeName"),
      utils.getRelationInstanceField(instance__product, "use", "useName"),
      utils.getRelationInstanceField(instance__product, "chemicalStructure", "chemicalStructureName"),
      utils.getRelationInstanceField(instance__product, "fdaPharmacologicalGroup", "fdaPharmacologicalGroupName"),
      utils.getRelationInstanceField(instance__product, "snomedCategory", "snomedCategoryName")
    ])
      .then(res => {
        res.forEach(e => {
          _.assign(instance__product.__data, e, {})
        })
      })
  })
};

