/**
 * This module is a wrapper for Node Validator that allows you
 * to validate specified value against the specified list of validators.
 * Returned errors are customizable.
 * Also, it provides Promise interface that allows you to use asynchronous
 * custom validators.
 */

var _ = require('lodash');
var nodeValidator = require('validator');
var Promise = require('bluebird');

module.exports = validateValue;


/**
 * Validates specified value according to the specified validators.
 * Returns promise that is rejected on failure with the list of failed validators.
 *
 * @param {*} value
 * @param {object} validators
 *
 * @returns {Promise}
 */
function validateValue (value, validators) {
  var errors = {};
  var promises = [];
  _.forEach(validators, function (originalValidatorDefinition, validatorName) {
    var validatorDefinition = getNormalizedDefinition(originalValidatorDefinition);
    validatorDefinition.options.unshift(value);
    promises.push(
      Promise
        .resolve(nodeValidator[validatorName].apply(nodeValidator, validatorDefinition.options))
        .then(function (isValid) {
          if (!isValid) {
            errors[validatorName] = validatorDefinition.message;
          }
        })
    );
  });
  return Promise
    .all(promises)
    .then(function () {
      if (!_.isEmpty(errors)) {
        return Promise.reject(errors);
      }
    })
  ;
}

/**
 * Normalizes validator's originalDefinition object.
 *
 * @param {object} originalDefinition
 *
 * @returns {object}
 */
function getNormalizedDefinition (originalDefinition) {
  var definition;
  if (true === originalDefinition) {
    definition = {};
  } else if (_.isArray(originalDefinition)) {
    definition = {
      options: _.clone(originalDefinition)
    };
  } else {
    definition = _.clone(originalDefinition);
  }
  if (!definition.options) {
    definition.options = [];
  }
  if (!definition.message) {
    definition.message = 'Validation failed';
  }
  return definition;
}
