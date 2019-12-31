const tables = require('../../common/data/tables');
const _ = require('lodash');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  _.keys(tables).forEach(key => {
    const table = tables[key];
    console.log(`${restApiRoot}/tables/${table.name}`)
    router.get(`${restApiRoot}/tables/${table.name}`, (req, res) => res.json(table))
  });

  server.use(router);
}