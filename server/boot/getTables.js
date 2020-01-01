const tables = require('../../common/data/detailForms');
const _ = require('lodash');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  _.keys(tables).forEach(key => {
    const table = tables[key];
    router.get(`${restApiRoot}/tables/${table.name}`, (req, res) => res.json(table))
  });

  server.use(router);
}