
var _ = require('lodash');
var Promise = require('bluebird');


module.exports = function (req, res, next, controllerDefinition) {

  var requestData;

  if ('function' === typeof controllerDefinition) {
    controllerDefinition(req, res, next);
    return;
  }

  if (!_.isPlainObject(controllerDefinition)) {
    throw new Error('Controller definition must be either a function or plain object');
  }

  normalizeControllerDefinition(controllerDefinition);

  // Custom request data should be stored in this property.
  req.data = {};

  Promise.resolve()
    .then(runMiddlewareBefore)
    .then(runController)
    .then(function (response) {
      res.json(response);
    })
    .catch(function (error) {
      req.log.error('Controller rejection:' + "\n", error.stack || error);
      res.json(error);
    })
    .finally(function () {
      next();
    })
  ;

  function runMiddlewareBefore () {
    if (!controllerDefinition.before || 0 == controllerDefinition.before.length) {
      return;
    }
    var queue = Promise.resolve();
    _.forEach(controllerDefinition.before, function (middlewareOptions, middlewarePath) {
      var middlewareFunction = _.get(app.middleware, middlewarePath);
      if ('function' !== typeof middlewareFunction) {
        throw new Error('Incorrect middleware "' + middlewarePath + '" for controller');
      }
      queue = queue.then(function () {
        return middlewareFunction(req, res, middlewareOptions);
      });
    });
    return queue;
  }

  function runController () {
    req.data = _.extend({}, req.data, requestData);
    return controllerDefinition.handler(req, res);
  }

};

function normalizeControllerDefinition (definition) {
  definition.input = (definition.input || {});
  if (!_.isFunction(definition.handler)) {
    throw new Error('Controller definition must has a handler function');
  }
}
