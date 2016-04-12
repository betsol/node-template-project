
const config = require('./../../config/database');

const MAIN_CONFIG = {
  dialect: 'postgres',
  host: config.hostname,
  database: config.database,
  username: 'postgres',
  password: 'postgres',
  migrationStorageTableName: 'migrations'
};


module.exports = {
  development: MAIN_CONFIG,
  production: MAIN_CONFIG
};
