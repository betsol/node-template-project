
var Promise = require('bluebird');
var fs = require('fs');

const SQL_BASE_PATH = __dirname + '/../sql';


module.exports = {

  runSqlFromFile: function (filePath, sequelize) {
    return Promise
      .resolve()
      .then(function () {
        return fs.readFileSync(filePath, 'utf-8');
      })
      .then(function (sql) {
        return sequelize.query(sql);
      })
    ;
  },

  sqlMigration: function (migrationName) {
    var self = this;
    return {
      up: function (queryInterface, Sequelize) {
        return self.runSqlFromFile(
          SQL_BASE_PATH + '/' + migrationName + '-up.pgsql',
          queryInterface.sequelize
        );
      },
      down: function (queryInterface, Sequelize) {
        return self.runSqlFromFile(
          SQL_BASE_PATH + '/' + migrationName + '-down.pgsql',
          queryInterface.sequelize
        );
      }
    };
  }

};
