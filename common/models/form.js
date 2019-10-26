const _ = require('lodash');
const app = require('../../server/server')

/**
 * @todo: add inputs for form
 * @todo: add options for input
 */
module.exports = (Form) => {
  Form.afterRemote('findOne', async (ctx) => {
    const CategoryModel = app.models.Category;
    const TherapyModel = app.models.Therapy;

    const form = ctx.result;
    const formName = form.__data.name;
    if (formName === 'createActiveIngredient') await fetchOptionsForPostActiveIngredientForm(form)

    ctx.result = form;
  })
}

fetchOptionsForPostActiveIngredientForm = async (form) => {
  const CategoryModel = app.models.Category;
  const TherapyModel = app.models.Therapy;

  let inputs = await form.inputs.find({ order: "displayIndex ASC" });

  await fetchOptionsForInput(inputs, CategoryModel, "categories", "categoryName");
  await fetchOptionsForInput(inputs, TherapyModel, "therapies", "therapyName");

  form.__data.inputs = inputs;
}

fetchOptionsForInput = async (inputs, Model, inputName, displayName) => {
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