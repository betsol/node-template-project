
var Promise = require('bluebird');
var restify = require('restify');
var util = require('util');
var requireDirectory = require('require-directory');
var pathModule = require('path');
var _ = require('lodash');


/**
 * AFTER: Logging
 */
module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      var errors = requireDirectory(module, pathModule.join(app.rootPath, '/errors/'));

      global.app.throw = function (errorName, message, data) {
        var errorDefinition = errors[errorName];
        var httpErrorName = errorDefinition.httpErrorName + 'Error';
        message = message || errorDefinition.defaultMessage;
        var httpErrorConstructor = restify.errors[httpErrorName];
        if ('function' !== typeof httpErrorConstructor) {
          throw Error('Could not find HTTP error constructor: "' + httpErrorName + '"');
        }
        var error = new httpErrorConstructor(message);
        error.body.code = errorName;
        if (data) {
          error.body.data = data;
        }
        throw error;
      };

      resolve();

    })
  }
};
