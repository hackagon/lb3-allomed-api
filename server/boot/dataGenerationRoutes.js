const { generateFormWithInputs } = require('../controllers/generateForm');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  router.post(`${restApiRoot}/generate-form`, generateFormWithInputs)


  server.use(router);
}