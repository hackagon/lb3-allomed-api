const _ = require("lodash");
const app = require("../../server/server");
const Promise = require("bluebird");

module.exports = Product => {
  /**
   * @todo: filter fields
   */
  Product.afterRemote("find", async ctx => {
    var items = ctx.result;
    if (Array.isArray(items)) {
      ctx.result = items.map(item => ({
        id: item.id,
        productName: item.productName,
        retailPrice: item.retailPrice
      }));
    }
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

    const activeIngredients = await instance__product.activeIngredients.find();
    const route = await instance__product.route.get();
    const categoryTrade = await instance__product.categoryTrade.get();
    const color = await instance__product.color.get();
    const characteristic = await instance__product.characteristic.get();
    const package = await instance__product.package.get();
    const country = await instance__product.country.get();
    const pharmacologicalMechanism = await instance__product.pharmacologicalMechanism.get();
    const pharmacologicalImpact = await instance__product.pharmacologicalImpact.get();
    const unit = await instance__product.unit.get();
    const toxicity = await instance__product.toxicity.get();
    const productGroup = await instance__product.productGroup.get();
    const ordor = await instance__product.ordor.get();
    const shape = await instance__product.shape.get();
    const otherCharacteristic = await instance__product.otherCharacteristic.get();
    const enterprise = await instance__product.enterprise.get();
    const categoryLabel = await instance__product.categoryLabel.get();
    const use = await instance__product.use.get();
    const chemicalStructure = await instance__product.chemicalStructure.get();
    const fdaPharmacologicalGroup = await instance__product.fdaPharmacologicalGroup.get();
    const snomedCategory = await instance__product.snomedCategory.get();
  });
};
