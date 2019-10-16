const { generateFormWithInputs } = require('../controllers/generateForm');
const postActiveIngredientForm = require('../../common/data/form/post.activeIngredient.form.json');
const postRouteForm = require('../../common/data/form/post.route.form.json');
const postCategoryTrade = require('../../common/data/form/post.categoryTrade.form.json');
const postTherapy = require('../../common/data/form/post.therapy.form.json');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  router.post(`${restApiRoot}/generate-form/postActiveIngredientForm`, generateFormWithInputs(postActiveIngredientForm))
  router.post(`${restApiRoot}/generate-form/postRouteForm`, generateFormWithInputs(postRouteForm))
  router.post(`${restApiRoot}/generate-form/postCategoryTrade`, generateFormWithInputs(postCategoryTrade))
  router.post(`${restApiRoot}/generate-form/postTherapy`, generateFormWithInputs(postTherapy))


  server.use(router);
}