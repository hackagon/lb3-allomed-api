const _ = require('lodash');
const { generateTherapy, generateCategory, generateColor } = require('../controllers/generateData');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  router.post(`${restApiRoot}/generate/therapy`, generateTherapy)
  router.post(`${restApiRoot}/generate/category`, generateCategory)
  router.post(`${restApiRoot}/generate/color`, generateColor)

  server.use(router);
}