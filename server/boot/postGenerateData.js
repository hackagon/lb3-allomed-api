const _ = require('lodash');
const { generateTherapy, generateCategory } = require('../controllers/generateData');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  router.post(`${restApiRoot}/generate/therapy`, generateTherapy)
  router.post(`${restApiRoot}/generate/category`, generateCategory)

  server.use(router);
}