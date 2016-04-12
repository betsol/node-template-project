/**
 * This module is a wrapper for Node Validator that allows you
 * to sanitize specified value against the specified list of sanitizers.
 * It provides sequential promise interface that allows you to use asynchronous
 * custom sanitizers.
 */

var _ = require('lodash');
var nodeValidator = require('validator');
var Promise = require('bluebird');

module.exports = sanitizeValue;


/**
 * Sanitizes specified value according to the specified sanitizers.
 * Returns promise.
 *
 * @param {*} value
 * @param {object} sanitizers
 *
 * @returns {Promise}
 */
function sanitizeValue (value, sanitizers) {
  var queue = Promise.resolve(value);
  _.forEach(sanitizers, function (sanitizerDefinition, sanitizerName) {
    queue = queue
      .then(function (value) {
        var options = (true === sanitizerDefinition ? [] : sanitizerDefinition);
        options.unshift(value);
        return nodeValidator[sanitizerName].apply(nodeValidator, options);
      });
  });
  return queue;
}
