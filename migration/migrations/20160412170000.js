
var path = require('path');
var helper = require('../lib/helper.js');

// Executes SQL migration with the same name.
module.exports = (
  helper.sqlMigration(path.parse(__filename).name)
);
