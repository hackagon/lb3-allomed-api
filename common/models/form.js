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

    let inputs = await form.inputs.find({ order: "displayIndex ASC" });

    for (const i in inputs) {
      const inp = inputs[i];
      let options;
      if (inp.name === "categories") {
        categories = await CategoryModel.find();
        options = categories.map(cate => {
          return {
            id: cate.id,
            displayEnglishName: cate.categoryName,
            displayVietnameseName: cate.categoryName
          }
        })
      } else if (inp.name === "therapies") {
        therapies = await TherapyModel.find();
        options = therapies.map(the => {
          return {
            id: the.id,
            displayEnglishName: the.therapyName,
            displayVietnameseName: the.therapyName
          }
        })
      } else {
        options = await inp.options.find();
      }


      inputs[i] = { ...inputs[i].__data, options }
    }

    ctx.result = { ...form.__data, inputs }
  })
}