
var Promise = require('bluebird');
var requireDirectory = require('require-directory');
var pathModule = require('path');
var _ = require('lodash');


/**
 * AFTER: [Logging], Database
 */
module.exports = {

  run: function () {

    var promises = [];

    var fixturePackages = requireDirectory(module, pathModule.join(app.rootPath, '/fixtures/'));

    _.forEach(fixturePackages, function (fixturePackage, fixturePackageName) {
      _.forEach(fixturePackage, function (fixtureMethod, fixtureMethodName) {
        if (app.log) {
          app.log.debug('Running fixture: ' + fixturePackageName + '.' + fixtureMethodName);
        }
        promises.push(fixtureMethod());
      });
    });

    return Promise.all(promises);

  }

};
