const app = require('../../server/server')
const postActiveIngredientForm = require('../../common/data/forms/post.activeIngredient.form.json');

/**
 * @todo generate form via POST method
 */
module.exports.generateFormWithInputs = (postMethodForm) => async (req, res, next) => {
  const FormModel = app.models.Form;
  const InputModel = app.models.Input;
  const OptionModel = app.models.Option;
  const formName = postMethodForm.name;

  try {
    let form;
    const existedForm = await FormModel.findOne({ where: { name: formName } })
    if (existedForm) {
      await existedForm.updateAttributes({ ...postMethodForm, id: existedForm.id })
      form = existedForm;
    } else {
      form = await FormModel.create(postMethodForm);
    }

    let count = 0;
    for (const inp of postMethodForm.inputs) {
      let _inp = inp;
      const existedInput = await InputModel.findOne({ where: { formId: form.id, name: inp.name } })
      if (existedInput) {
        _inp = await existedInput.updateAttributes({ ...inp, formId: form.id })
      } else {
        _inp = await InputModel.create({ ...inp, formId: form.id })
      }

      await _inp.options.destroyAll();
      if (inp.options) {
        for (const opt of inp.options) {
          await OptionModel.create({
            inputId: _inp.id,
            displayEnglishName: opt.displayEnglishName,
            displayVietnameseName: opt.displayVietnameseName
          })
        }
      }

      console.log(count)
      count++;
    }

    console.log("done")

    res.status(200).json({ message: "Generate form successfully" });
  } catch (error) {
    res.status(400).json(error)
  }
}

/**
 * @todo
 */

/**
 * @todo update form via PUT method
 */