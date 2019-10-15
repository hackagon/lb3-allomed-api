const _ = require('lodash');

module.exports = (Form) => {
  Form.afterRemote('findOne', async (ctx) => {
    const form = ctx.result;

    // const inputs = await form.inputs.find({ order: "displayIndex ASC" });
    let inputs = await form.inputs.find({});

    for (const i in inputs) {
      const inp = inputs[i];
      const options = await inp.options.find();
      inputs[i] = { ...inputs[i].__data, options }
    }

    ctx.result = { ...form.__data, inputs }
  })
}