module.exports = (Form) => {
  Form.afterRemote('findOne', async (ctx) => {
    const form = ctx.result;
    const inputs = await form.inputs.find({ order: "displayIndex ASC" });
    ctx.result = { ...form.__data, inputs }
  })
}