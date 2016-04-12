
var Promise = require('bluebird');
var _ = require('lodash');


module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      // Applying environment config.
      if (app.environment && app.config.environment[app.environment]) {
        _.merge(app.config, app.config.environment[app.environment]);
      }

      // Removing environment configurations from config.
      delete app.config.environment;

      resolve();

    })
  }
};
