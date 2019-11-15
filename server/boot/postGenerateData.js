const _ = require('lodash');
const { generateDataForSingleTable } = require('../controllers/generateData');

const mockup = require('../../mockup');

const app = require('../server');
const { Shape } = app.models;

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  _.keys(mockup).forEach(key => {
    const item = mockup[key];
    router.post(`${restApiRoot}/generate/${item.endpoint}`, generateDataForSingleTable(app.models[item.model], item.csvFileName))
  })

  server.use(router);
}