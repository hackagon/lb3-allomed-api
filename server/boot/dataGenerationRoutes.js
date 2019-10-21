const { generateFormWithInputs } = require('../controllers/generateForm');
const postActiveIngredientForm = require('../../common/data/forms/post.activeIngredient.form.json');
const postRouteForm = require('../../common/data/forms/post.route.form.json');
const postCategoryTrade = require('../../common/data/forms/post.categoryTrade.form.json');
const postTherapy = require('../../common/data/forms/post.therapy.form.json');
const postCategory = require('../../common/data/forms/post.category.form.json');
const postColor = require('../../common/data/forms/post.color.form.json');
const postCharacteristic = require('../../common/data/forms/post.characteristic.form.json');
const postPackage = require('../../common/data/forms/post.package.form.json');
const postCountry = require('../../common/data/forms/post.country.form.json');

module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  router.post(`${restApiRoot}/generate-form/postActiveIngredientForm`, generateFormWithInputs(postActiveIngredientForm))
  router.post(`${restApiRoot}/generate-form/postRouteForm`, generateFormWithInputs(postRouteForm))
  router.post(`${restApiRoot}/generate-form/postCategoryTrade`, generateFormWithInputs(postCategoryTrade))
  router.post(`${restApiRoot}/generate-form/postTherapy`, generateFormWithInputs(postTherapy))
  router.post(`${restApiRoot}/generate-form/postCategory`, generateFormWithInputs(postCategory))
  router.post(`${restApiRoot}/generate-form/postColor`, generateFormWithInputs(postColor))
  router.post(`${restApiRoot}/generate-form/postCharacteristic`, generateFormWithInputs(postCharacteristic))
  router.post(`${restApiRoot}/generate-form/postPackage`, generateFormWithInputs(postPackage))
  router.post(`${restApiRoot}/generate-form/postCountry`, generateFormWithInputs(postCountry))


  server.use(router);
}