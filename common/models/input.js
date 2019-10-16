const _ = require('lodash');
const app = require('../../server/server')

/**
 * @todo Auto increase display_index (with in a specific formId)
 */
module.exports = (Input) => {
  Input.observe("before save", async (ctx) => {
    const input = ctx.instance || ctx.result;
    if (!input) return;
    const formId = input.formId
    const FormModel = app.models.Form;
    const form = await FormModel.findById(formId, { include: "inputs" })
    const maxDisplayIndexInput = await form.inputs.findOne({ order: "displayIndex DESC" })

    let nextDisplayIndex;
    if (maxDisplayIndexInput) {
      nextDisplayIndex = maxDisplayIndexInput.displayIndex + 1;
    } else {
      nextDisplayIndex = 0;
    }
    ctx.instance.displayIndex = nextDisplayIndex;
  })
}