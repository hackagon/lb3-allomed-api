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
    if (formName === 'createActiveIngredient') await modifyPostActiveIngredientForm(form)
    if (formName === 'createProduct') await modifyPostProductForm(form)

    ctx.result = form;
  })
}

/**
 * @param inputs the list of inputs
 * @param Model  Model which will find instances --> create options for input
 * @param inputName  name of input which should have many options
 * @param displayName fieldName which is chosen to display as options
 */
fetchOptionsForInput = async (inputs, Model, inputName, displayName) => {
  console.log("TCL: fetchOptionsForInput -> inputs", inputs)
  const inputIndex = inputs.findIndex(elm => elm.name === inputName)
  const instances = await Model.find();
  options = instances.map(inst => {
    return {
      id: inst.id,
      displayEnglishName: inst[displayName],
      displayVietnameseName: inst[displayName]
    }
  })
  inputs[inputIndex].__data.options = options;
}

/**
 * @param form form which should be modified
 */
modifyPostActiveIngredientForm = async (form) => {
  const CategoryModel = app.models.Category;
  const TherapyModel = app.models.Therapy;

  let inputs = await form.inputs.find({ order: "displayIndex ASC" });

  await fetchOptionsForInput(inputs, CategoryModel, "categories", "categoryName");
  await fetchOptionsForInput(inputs, TherapyModel, "therapies", "therapyName");

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

  await fetchOptionsForInput(inputs, ActiveIngredientModel, "activeIngredients", "activeIngredientName");
  await fetchOptionsForInput(inputs, CategoryLabelModel, "categoryLabel", "categoryLabelName");

  form.__data.inputs = inputs;
}