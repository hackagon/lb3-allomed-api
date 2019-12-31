// const { generateFormWithInputs } = require('../controllers/generateForm');

// const _ = require('lodash');
// const forms = require('../../common/data/forms');

// module.exports = (server) => {
//   const router = server.loopback.Router();
//   const restApiRoot = server.get('restApiRoot');

//   _.keys(forms).forEach(elm => {
//     const form = forms[elm];
//     router.post(`${restApiRoot}/generate-form/${elm}`, generateFormWithInputs(form))
//   })

//   server.use(router);
// }