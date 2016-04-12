
var Promise = require('bluebird');
var _ = require('lodash');


module.exports = {
  input: function (req, res, options) {

    var requestData = {};
    var requestFiles = {};

    return Promise.resolve()
      .then(getRequestData)
      .then(checkRequired)
      .then(sanitizeRequest)
      .then(validateRequest)
      .then(validateFiles)
      .then(handleFiles)
      .then(function () {
        req.data = _.extend({}, req.data || {}, requestData);
        req.dataFiles = _.extend({}, requestFiles);
      })
    ;

    function getRequestData () {
      var requestDataPickerOptions = {
        map: options.fields || {}
      };
      if (options.defaultPath) {
        requestDataPickerOptions.path = options.defaultPath;
      }
      requestData = app.services.Framework.RequestDataPicker(req, requestDataPickerOptions);
    }

    function checkRequired () {
      var validationErrors = {};
      _.forEach(options.fields, function (fieldDefinition, fieldName) {
        var fieldValue = requestData[fieldName];
        // Making sure required field is present in the request.
        if (fieldDefinition.required && null === fieldValue) {
          validationErrors[fieldName] = {
            'isRequired': 'Field is required'
          };
        }
      });
      if (!_.isEmpty(validationErrors)) {
        app.throw('ValidationFailed', null, validationErrors);
      }
    }

    function sanitizeRequest () {

      var promises = [];

      _.forEach(options.fields, function (fieldDefinition, fieldName) {

        var fieldValue = requestData[fieldName];

        // Sanitizing the field.
        if (fieldDefinition.sanitize) {
          promises.push(
            app.services.Framework.ValueSanitizer(fieldValue, fieldDefinition.sanitize)
              .then(function (sanitizedValue) {
                requestData[fieldName] = sanitizedValue;
              })
          );
        }

      });

      return Promise.all(promises);
    }

    function validateRequest () {

      var promises = [];
      var validationErrors = {};

      _.forEach(options.fields, function (fieldDefinition, fieldName) {

        var fieldValue = requestData[fieldName];

        // Validating the field.
        if (fieldDefinition.validate) {
          promises.push(
            app.services.Framework.ValueValidator(fieldValue, fieldDefinition.validate)
              .catch(function (fieldErrors) {
                validationErrors[fieldName] = fieldErrors;
              })
          );
        }

      });

      return Promise
        .all(promises)
        .then(function () {
          if (!_.isEmpty(validationErrors)) {
            app.throw('ValidationFailed', null, validationErrors);
          }
        })
      ;
    }

    function validateFiles () {
      var validationErrors = {};
      _.forEach(options.files, function (fileDefinition, fieldName) {
        if (true === fileDefinition.required && !req.files[fieldName]) {
          validationErrors['@' + fieldName] = {
            required: 'Missing required file'
          };
        }
      });
      if (!_.isEmpty(validationErrors)) {
        app.throw('ValidationFailed', null, validationErrors);
      }
    }

    function handleFiles () {
      _.forEach(options.files, function (fileDefinition, fieldName) {
        requestFiles[fieldName] = req.files[fieldName];
      });
    }

  }
};
