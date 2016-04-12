
var Promise = require('bluebird');
var requireDirectory = require('require-directory');
var pathModule = require('path');
var _ = require('lodash');


/**
 * AFTER: [Logging], Server
 */
module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      var controllers = requireDirectory(module, pathModule.join(app.rootPath, '/controllers/'));

      _.forEach(app.config.routes, function (target, match) {
        var matches = match.match(/^([A-Z]+)\s(.*)$/);
        if (3 !== matches.length) {
          var message = 'Incorrect route: ' + match + ', skipping';
          if (app.log) {
            app.log.warn(message);
          } else {
            console.log(message);
          }
          return;
        }
        var httpMethod = matches[1];
        var urlDefinition = matches[2];
        var controllerDefinition = _.get(controllers, target);
        if (!controllerDefinition) {
          throw new Error('Missing controller "' + target + '"');
        }
        if (app.log) {
          app.log.debug('Adding route', {
            httpMethod: httpMethod,
            urlDefinition: urlDefinition
          });
        }
        app.server[httpMethod.toLowerCase()](urlDefinition, function (req, res, next) {
          app.services.Framework.RouteHandler(req, res, next, controllerDefinition);
        });
      });

      resolve();

    })
  }
};
