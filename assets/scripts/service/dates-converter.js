
'use strict';

var angular = require('angularjs');
var moment = require('moment');

var MODULE_NAME = 'app.service.datesConverter';

module.exports = MODULE_NAME;


angular
  .module(MODULE_NAME, [
    require('./recursive-iterator.js')
  ])
  .service('DatesConverter', function (RecursiveIterator) {
    return function DatesConverter (targetFormat) {

      if ('string' !== targetFormat && 'object' !== targetFormat) {
        throw 'Incorrect conversion type for DatesConverter: "' + targetFormat + '".';
      }

      // This RegEx will match dates in ISO:8601 format.
      var regex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?)(\+\d{4}|Z)?$/;

      var stringToDate = function (dateString) {
        return moment(dateString);
      };

      /**
       * Converts Moment.js date or standard date
       * to a string in ISO:8601 format without timezone.
       *
       * @param {object|Date} date
       *
       * @returns {string}
       */
      var dateToString = function (date) {
        if (moment.isMoment(date)) {
          return date.format('YYYY-MM-DDTHH:mm:ss');
        } else if (date instanceof Date) {
          return window.dateToISOStringNoTZ(date);
        }
      };

      /**
       * Returns true if specified object is Moment.js date
       * or standard date object.
       *
       * @param {object} object
       *
       * @returns {boolean}
       */
      var isDateObject = function (object) {
        return (moment.isMoment(object) || object instanceof Date);
      };

      var iterator = new RecursiveIterator(
        function valueHandler (key, value) {
          switch (targetFormat) {
            case 'string':
              // Looking for an object value to convert it to string.
              if (isDateObject(value)) {
                return dateToString(value);
              }
              break;
            case 'object':
              // Looking for a string value to convert it to object.
              var matches = regex.exec(value);
              if (null !== matches) {
                return stringToDate(value);
              }
              break;
          }
        },
        function objectHandler (key, object) {
          // Returning false for Date and moment objects.
          // This will force recursive iterator to handle this case via standard value handler,
          // instead of iterating the object as a key-value pairs.
          return !isDateObject(object);
        }
      );

      return {
        convertRecursively: function (object) {
          iterator.iterate(object);
        }
      };

    };
  })
;
