'use strict';

const loopback = require('loopback');
const { promisify } = require('util');
const fs = require('fs');
const _ = require('lodash')

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdirp = promisify(require('mkdirp'));

const DATASOURCE_NAME = 'allomed';
const dataSourceConfig = require('../server/datasources.json');
const db = new loopback.DataSource(dataSourceConfig[DATASOURCE_NAME]);

module.exports = (tableName) => discover(tableName)
  .then(() => process.exit())
  .catch(error => {
    console.error('UNHANDLED ERROR:\n', error);
    process.exit(1);
  })

async function discover(tableName) {
  const options = { relations: false };

  // Discover models and relations
  const newSchema = await db.discoverSchemas(tableName, options);

  // Create model definition files
  await mkdirp('common/models');
  await writeFile(`common/models/${tableName}.json`, JSON.stringify(newSchema[`dbpha.${tableName}`], null, 2));

  // Expose models via REST API
  const configJson = await readFile('server/model-config.json', 'utf-8');
  const config = JSON.parse(configJson);
  config[`${_.upperFirst(tableName)}`] = { dataSource: DATASOURCE_NAME, public: true };

  await writeFile('server/model-config.json', JSON.stringify(config, null, 2));
}