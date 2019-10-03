'use strict';

const loopback = require('loopback');
const promisify = require('util').promisify;
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require('mkdirp'));

const DATASOURCE_NAME = 'allomed';
const dataSourceConfig = require('./server/datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

discover().then(
  success => process.exit(),
  error => { console.error('UNHANDLED ERROR:\n', error); process.exit(1); },
);

async function discover() {
  // It's important to pass the same "options" object to all calls
  // of dataSource.discoverSchemas(), it allows the method to cache
  // discovered related models
  const options = { relations: false };

  // Discover models and relations
  const categorySchemas = await db.discoverSchemas('category', options);
  const activeIngredientSchemas = await db.discoverSchemas('active_ingredient', options);
  const activeIngredientCategorySchemas = await db.discoverSchemas('active_ingredient_category', options);

  // Create model definition files
  await mkdirp('common/models');
  await writeFile('common/models/category.json', JSON.stringify(categorySchemas['dbpha.category'], null, 2));
  await writeFile('common/models/activeIngredient.json', JSON.stringify(activeIngredientSchemas['dbpha.active_ingredient'], null, 2));
  await writeFile('common/models/activeIngredientCategory.json', JSON.stringify(activeIngredientCategorySchemas['dbpha.active_ingredient_category'], null, 2));

  // Expose models via REST API
  const configJson = await readFile('server/model-config.json', 'utf-8');
  const config = JSON.parse(configJson);
  config.Category = { dataSource: DATASOURCE_NAME, public: true };
  config.ActiveIngredient = { dataSource: DATASOURCE_NAME, public: true };
  config.ActiveIngredientCategory = { dataSource: DATASOURCE_NAME, public: true };

  await writeFile('server/model-config.json', JSON.stringify(config, null, 2));
}