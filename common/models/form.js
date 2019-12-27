const _ = require('lodash');
const app = require('../../server/server')

/**
 * @todo: add inputs for form
 * @todo: add options for input
 */
module.exports = (Form) => {
  Form.afterRemote('findOne', async (ctx) => {
    const form = ctx.result;
    const formName = form.__data.name;
    switch (formName) {
      case 'createActiveIngredient':
        await modifyPostActiveIngredientForm(form)
        break;

      case 'createProduct':
        await modifyPostProductForm(form)
        break;

      // case 'createStore':
      //   await modifyPostStoreForm(form)
      //   break;

      default:
        const inputs = await form.inputs.find({ order: "displayIndex ASC" });
        await fetchOptions(inputs);
        form.__data.inputs = inputs;
    }
    ctx.result = form;
  })
}

fetchOptions = async (inputs) => {
  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i];
    if (inp.type === 'radio' || inp.type === 'multiplechoice' || inp.type === 'select' || inp.type === 'singleChoice') {
      const options = await inp.options.find();
      if (!_.isEmpty(options)) inputs[i].__data.options = options;
    }
  }
}

/**
 * @param inputs the list of inputs
 * @param Model  Model which will find instances --> create options for input
 * @param inputName  name of input which should have many options
 * @param displayName fieldName which is chosen to display as options
 */
fetchOptionsForInput = async (inputs, Model, inputName, displayName) => {
  // fetchOptions(inputs);
  const inputIndex = inputs.findIndex(elm => elm.name === inputName)
  const instances = await Model.find();
  options = instances.map(inst => {
    return {
      id: inst.id,
      displayEnglishName: inst[displayName],
      displayVietnameseName: inst[displayName]
    }
  })
  if (inputIndex > -1) inputs[inputIndex].__data.options = options;
}

/**
 * @param form form which should be modified
 */
modifyPostActiveIngredientForm = async (form) => {
  const CategoryModel = app.models.Category;
  const TherapyModel = app.models.Therapy;

  let inputs = await form.inputs.find({ order: "displayIndex ASC" });

  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i];
    if (inp.type === "text") continue;

    inp.options.find()
      .then(options => {
        if (!_.isEmpty(options)) {
          inp.__data.options = options;
        }
      })
  }

  await Promise.all([
    fetchOptionsForInput(inputs, CategoryModel, "categories", "categoryName"),
    fetchOptionsForInput(inputs, TherapyModel, "therapies", "therapyName")
  ])

  form.__data.inputs = inputs;
}

/**
 * @param form
 */
modifyPostProductForm = async (form) => {
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

  let inputs = await form.inputs.find({ order: "displayIndex ASC" });

  for (let i = 0; i < inputs.length; i++) {
    const inp = inputs[i];
    if (!inp.needQuery) continue;

    inp.options.find()
      .then(options => {
        if (!_.isEmpty(options)) {
          inp.__data.options = options;
        }
      })
  }

  await Promise.all([
    fetchOptionsForInput(inputs, ActiveIngredientModel, "activeIngredients", "activeIngredientName"),
    fetchOptionsForInput(inputs, CategoryLabelModel, "categoryLabelId", "categoryLabelName"),
    fetchOptionsForInput(inputs, CategoryTradeModel, "categoryTradeId", "categoryTradeName"),
    fetchOptionsForInput(inputs, CharacteristicModel, "characteristicId", "characteristicName"),
    fetchOptionsForInput(inputs, ChemicalStructureModel, "chemicalStructureId", "chemicalStructure"),
    fetchOptionsForInput(inputs, ColorModel, "colorId", "colorName"),
    fetchOptionsForInput(inputs, CountryModel, "distributionCountryId", "countryName"),
    fetchOptionsForInput(inputs, EnterpriseModel, "distributionEnterpriseId", "enterpriseName"),
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

  form.__data.inputs = inputs;
}


/**
 * @param form form which should be modified
 */
// modifyPostStoreForm = async (form) => {
//   const StoreModel = app.models.Store;

//   let inputs = await form.inputs.find({ order: "displayIndex ASC" });

//   for (let i = 0; i < inputs.length; i++) {
//     const inp = inputs[i];
//     if (inp.type === "text") continue;

//     inp.options.find()
//       .then(options => {
//         if (!_.isEmpty(options)) {
//           inp.__data.options = options;
//         }
//       })
//   }

//   await Promise.all([
//     fetchOptionsForInput(inputs, StoreModel, "store", "storeName"),
//   ])

//   form.__data.inputs = inputs;
// }