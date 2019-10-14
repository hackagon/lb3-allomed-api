const app = require('../../server/server')
const postActiveIngredientForm = require('../../common/data/form/post.activeIngredient.form.json');


/**
 * @todo generate form via POST method
 */
module.exports.generateFormWithInputs = async (req, res, next) => {
  const FormModel = app.models.Form;
  const InputModel = app.models.Input;
  const formName = postActiveIngredientForm.name;

  try {
    let form;
    const existedForm = await FormModel.findOne({ name: formName })
    if (existedForm) {
      await existedForm.updateAttributes({ ...postActiveIngredientForm, id: existedForm.id })
      form = existedForm;
    } else {
      form = await FormModel.create(postActiveIngredientForm);
    }

    await postActiveIngredientForm.inputs.map(async input => {
      try {
        const existedInput = await InputModel.findOne({ where: { formId: form.id, name: input.name } })
        if (existedInput) {
          await existedInput.updateAttributes({ ...input, formId: form.id })
        } else {
          await InputModel.create({ ...input, formId: form.id })
        }
      } catch (error) {
        res.status(400).json(error)
      }
    })

    res.status(200).json({ message: "Generate form successfully" });
  } catch (error) {
    res.status(400).json(error)
  }
}

/**
 * @todo update form via PUT method
 */