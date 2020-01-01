const forms = require('../../common/forms/listForms');
const _ = require('lodash');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  _.keys(forms).forEach(key => {
    const form = forms[key];
    router.get(`${restApiRoot}/uiforms/list/${form.name}`, (req, res) => res.json(form))
  });

  server.use(router);
}