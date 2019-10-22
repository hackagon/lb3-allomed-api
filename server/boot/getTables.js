const activeIngredientsTable = require('../../common/data/tables/get.activeIngredients.table.json');
const productsTable = require('../../common/data/tables/get.products.table.json');
const categoriesTable = require('../../common/data/tables/get.categories.table.json');
const therapiesTable = require('../../common/data/tables/get.therapies.table.json');
const routesTable = require('../../common/data/tables/get.routes.table.json');
const categoryTradesTable = require('../../common/data/tables/get.categoryTrades.table.json');
const colorsTable = require('../../common/data/tables/get.colors.table.json');
const characteristicsTable = require('../../common/data/tables/get.characteristics.table.json');
const packagesTable = require('../../common/data/tables/get.packages.table.json');
const countriesTable = require('../../common/data/tables/get.countries.table.json');
const pharmacologicalMechanismsTable = require('../../common/data/tables/get.pharmacologicalMechanisms.table.json');
const pharmacologicalImpactsTable = require('../../common/data/tables/get.pharmacologicalImpacts.table.json');
const unitsTable = require('../../common/data/tables/get.units.table.json');
const toxicitiesTable = require('../../common/data/tables/get.toxicities.table.json');
const productGroupsTable = require('../../common/data/tables/get.productGroups.table.json');
const odorsTable = require('../../common/data/tables/get.odors.table.json');

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
  router.get(`${restApiRoot}/tables/packages`, (req, res) => res.json(packagesTable))
  router.get(`${restApiRoot}/tables/countries`, (req, res) => res.json(countriesTable))
  router.get(`${restApiRoot}/tables/pharmacologicalMechanisms`, (req, res) => res.json(pharmacologicalMechanismsTable))
  router.get(`${restApiRoot}/tables/pharmacologicalImpacts`, (req, res) => res.json(pharmacologicalImpactsTable))
  router.get(`${restApiRoot}/tables/units`, (req, res) => res.json(unitsTable))
  router.get(`${restApiRoot}/tables/toxicities`, (req, res) => res.json(toxicitiesTable))
  router.get(`${restApiRoot}/tables/productGroups`, (req, res) => res.json(productGroupsTable))
  router.get(`${restApiRoot}/tables/odors`, (req, res) => res.json(odorsTable))

  server.use(router);
}