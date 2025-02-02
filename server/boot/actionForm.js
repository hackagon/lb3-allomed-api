const EventEmitter = require('events');
const actionForms = require('../../common/forms/actionForms');
const _ = require('lodash');
const app = require('../server');

const emitter = new EventEmitter();
emitter.setMaxListeners(20)

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  _.keys(actionForms).forEach(key => {
    const form = actionForms[key];
    router.get(`${restApiRoot}/uiforms/action/${form.name}`, async (req, res) => {
      switch (form.name) {
        case "products":
          await modifyPostProductForm(form)
          break;

        case "activeIngredients":
          await modifyPostActiveIngredientForm(form)
          break;

        case "inventories":
          await modifyPostInventoryForm(form)
          break;

        case "conversions":
          await modifyPostConversionForm(form)
          break;

        case "inventoryLines":
          await modifyPostInventoryLineForm(form)
          break;

        case "prices":
          await modifyPostPriceForm(form)
          break;

        case "salesSlipLines":
          await modifyPostSalesSlipLineForm(form, req.query)
          break;

        default:
          break;
      }
      res.status(200).json(form)
    })
  });

  server.use(router);
}

/**
 * @param inputs the list of inputs
 * @param Model  Model which will find instances --> create options for input
 * @param inputName  name of input which should have many options
 * @param displayName fieldName which is chosen to display as options
 */
const fetchOptionsForInput = async (inputs, Model, inputName, displayName, query = {}) => {
  // fetchOptions(inputs);
  const inputIndex = inputs.findIndex(elm => elm.name === inputName)
  const instances = await Model.find({ where: query });
  const options = instances.map(inst => {
    return {
      id: inst.id,
      value: inst.id,
      displayEnglishName: inst[displayName],
      displayVietnameseName: inst[displayName]
    }
  })
  if (inputIndex > -1) inputs[inputIndex].options = options;
}

const modifyPostActiveIngredientForm = async (form) => {
  const ModelCategory = app.models.Category;
  const ModelTherapy = app.models.Therapy;
  const ModelEnterprise = app.models.Enterprise

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, ModelCategory, "categoryIds", "categoryName"),
    fetchOptionsForInput(inputs, ModelTherapy, "therapyIds", "therapyName"),
    fetchOptionsForInput(inputs, ModelEnterprise, "supplierId", "enterpriseName"),
    fetchOptionsForInput(inputs, ModelEnterprise, "producerId", "enterpriseName")
  ])

  form.inputs = inputs;
}

const modifyPostProductForm = async (form) => {
  const ActiveIngredientModel = app.models.ActiveIngredient;
  const RouteModel = app.models.Route;
  const CategoryTradeModel = app.models.CategoryTrade;
  const ColorModel = app.models.Color;
  const CharacteristicModel = app.models.Characteristic;
  const PackageModel = app.models.Package;
  const CountryModel = app.models.Country;
  const PharmacologicalMechanismModel = app.models.PharmacologicalMechanism;
  const PharmacologicalImpactModel = app.models.PharmacologicalImpact;
  const UnitModel = app.models.Unit;
  const Icd10Model = app.models.Icd10;
  const ToxicityModel = app.models.Toxicity;
  const ProductGroupModel = app.models.ProductGroup;
  const OdorModel = app.models.Odor;
  const ShapeModel = app.models.Shape;
  const OtherCharacteristicModel = app.models.OtherCharacteristic;
  const EnterpriseModel = app.models.Enterprise;
  const CategoryLabelModel = app.models.CategoryLabel;
  const UseModel = app.models.Use;
  const ChemicalStructureModel = app.models.ChemicalStructure;
  const FdaPharmacologicalGroupModel = app.models.FdaPharmacologicalGroup;
  const SnomedCategoryModel = app.models.SnomedCategory;

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, ActiveIngredientModel, "activeIngredientIds", "activeIngredientName"),
    fetchOptionsForInput(inputs, CategoryLabelModel, "categoryLabelId", "categoryLabelName"),
    fetchOptionsForInput(inputs, CategoryTradeModel, "categoryTradeId", "categoryTradeName"),
    fetchOptionsForInput(inputs, CharacteristicModel, "characteristicId", "characteristicName"),
    fetchOptionsForInput(inputs, ChemicalStructureModel, "chemicalStructureId", "chemicalStructure"),
    fetchOptionsForInput(inputs, ColorModel, "colorId", "colorName"),
    fetchOptionsForInput(inputs, CountryModel, "distributionCountryId", "countryName"),
    fetchOptionsForInput(inputs, CountryModel, "manufacturingCountryId", "countryName"),
    fetchOptionsForInput(inputs, EnterpriseModel, "distributionEnterpriseId", "enterpriseName"),
    fetchOptionsForInput(inputs, EnterpriseModel, "manufacturingEnterpriseId", "enterpriseName"),
    fetchOptionsForInput(inputs, FdaPharmacologicalGroupModel, "fdaPharmacologicalGroupId", "groupName"),
    fetchOptionsForInput(inputs, OdorModel, "odorId", "odorName"),
    fetchOptionsForInput(inputs, OtherCharacteristicModel, "otherCharacteristicId", "characteristic"),
    fetchOptionsForInput(inputs, PackageModel, "packageId", "packageName"),
    fetchOptionsForInput(inputs, PharmacologicalImpactModel, "pharmacologicalImpactId", "pharmacologicalImpact"),
    fetchOptionsForInput(inputs, PharmacologicalMechanismModel, "pharmacologicalMechanismId", "pharmacologicalMechanism"),
    fetchOptionsForInput(inputs, ProductGroupModel, "productGroupId", "productGroupName"),
    fetchOptionsForInput(inputs, RouteModel, "routeId", "routeName"),
    fetchOptionsForInput(inputs, ShapeModel, "shapeId", "shapeName"),
    fetchOptionsForInput(inputs, SnomedCategoryModel, "snomedCategoryId", "categoryName"),
    fetchOptionsForInput(inputs, ToxicityModel, "toxicityId", "toxicityName"),
    fetchOptionsForInput(inputs, UnitModel, "unitId", "unitName"),
    fetchOptionsForInput(inputs, UseModel, "useId", "use"),
  ])

  form.inputs = inputs;
}

const modifyPostInventoryForm = async (form) => {
  const StoreModel = app.models.Store;
  const EnterpriseModel = app.models.Enterprise;

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, StoreModel, "storeId", "storeName"),
    fetchOptionsForInput(inputs, EnterpriseModel, "supplyEnterpriseId", "enterpriseName"),
  ])

  form.inputs = inputs;
}

const modifyPostInventoryLineForm = async (form) => {
  const ProductModel = app.models.Product;
  const ConversionModel = app.models.Conversion;

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, ProductModel, "productId", "productName"),
    fetchOptionsForInput(inputs, ConversionModel, "conversionId", "conversionName"),
  ])

  form.inputs = inputs;
}

const modifyPostConversionForm = async (form) => {
  const ModelUnit = app.models.Unit;

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, ModelUnit, "fromUnitId", "unitName"),
    fetchOptionsForInput(inputs, ModelUnit, "toUnitId", "unitName")
  ])

  form.inputs = inputs;
}

const modifyPostPriceForm = async (form) => {
  const ModelProduct = app.models.Product;
  const ModelConversion = app.models.Conversion;

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, ModelProduct, "productId", "productName"),
    fetchOptionsForInput(inputs, ModelConversion, "conversionId", "conversionName"),
  ])

  form.inputs = inputs;
}

const modifyPostSalesSlipLineForm = async (form, query) => {
  const ModelProduct = app.models.Product;
  const ModelUnit = app.models.Unit;
  const ModelConversion = app.models.Conversion;
  const ModelPrice = app.models.Price;
  const ModelStore = app.models.Store;

  const { productId } = query;

  const inputs = form.inputs;

  await Promise.all([
    fetchOptionsForInput(inputs, ModelStore, "storeId", "storeName"),
    fetchOptionsForInput(inputs, ModelProduct, "productId", "productName"),
    fetchOptionsForInput(inputs, ModelUnit, "unitId", "unitName"),
    fetchOptionsForInput(inputs, ModelUnit, "usingUnitId", "unitName"),
    fetchOptionsForInput(inputs, ModelConversion, "conversionId", "conversionName"),
    fetchOptionsForInput(inputs, ModelPrice, "priceId", "price", { productId })
  ])

  form.inputs = inputs;
}