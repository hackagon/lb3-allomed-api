const activeIngredientsTable = require('../../common/data/tables/get.activeIngredients.table.json');
const productsTable = require('../../common/data/tables/get.products.table.json');
const categoriesTable = require('../../common/data/tables/get.categories.table.json');
const therapiesTable = require('../../common/data/tables/get.therapies.table.json');
const routesTable = require('../../common/data/tables/get.routes.table.json');
const categoryTradesTable = require('../../common/data/tables/get.categoryTrades.table.json');
const colorsTable = require('../../common/data/tables/get.colors.table.json');
const characteristicsTable = require('../../common/data/tables/get.characteristics.table.json');


module.exports = (server) => {
  const router = server.loopback.Router();
  const restApiRoot = server.get('restApiRoot');

  router.get(`${restApiRoot}/tables/ActiveIngredients`, (req, res) => res.json(activeIngredientsTable))
  router.get(`${restApiRoot}/tables/products`, (req, res) => res.json(productsTable))
  router.get(`${restApiRoot}/tables/categories`, (req, res) => res.json(categoriesTable))
  router.get(`${restApiRoot}/tables/therapies`, (req, res) => res.json(therapiesTable))
  router.get(`${restApiRoot}/tables/routes`, (req, res) => res.json(routesTable))
  router.get(`${restApiRoot}/tables/categoryTrades`, (req, res) => res.json(categoryTradesTable))
  router.get(`${restApiRoot}/tables/colors`, (req, res) => res.json(colorsTable))
  router.get(`${restApiRoot}/tables/characteristics`, (req, res) => res.json(characteristicsTable))

  server.use(router);
}