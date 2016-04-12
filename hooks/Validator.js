
var Promise = require('bluebird');
var requireDirectory = require('require-directory');
var pathModule = require('path');
var _ = require('lodash');
var validator = require('validator');


/**
 * AFTER: [Logging]
 */
module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {
      var validators = requireDirectory(module, pathModule.join(app.rootPath, '/validators/'));
      _.forEach(validators, function (validatorFunction, validatorName) {
        validator.extend(validatorName, validatorFunction);
        if (app.log) {
          app.log.debug('Added validator "' + validatorName + '"');
        }
      });
      resolve();
    })
  }
};
