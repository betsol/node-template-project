
'use strict';

var angular = require('angularjs');

var MODULE_NAME = 'app.service.recursiveIterator';

module.exports = MODULE_NAME;


angular
  .module(MODULE_NAME, [])
  .factory('RecursiveIterator', function () {
    return function RecursiveIterator (valueCallback, objectCallback) {
      return {
        valueCallback: valueCallback,
        objectCallback: objectCallback,
        setVallueCallback: function (vallueCallback) {
          this.valueCallback = vallueCallback;
        },
        setObjectCallback: function (objectCallback) {
          this.objectCallback = objectCallback;
        },
        iterate: function (object) {

          var self = this;

          var handleValue = function (key, value) {
            var newValue = self.valueCallback(key, value);
            if ('undefined' !== typeof newValue) {
              object[key] = newValue;
            }
          };

          for (var key in object) {

            if (!object.hasOwnProperty(key)) {
              continue;
            }

            var value = object[key];

            if ('object' === typeof value && null !== value) {

              // Calling an object callback to decide what to do with this object.
              if ('function' === typeof self.objectCallback) {
                if (self.objectCallback(key, value)) {
                  // Iterating an object if callback returned true.
                  self.iterate(object[key]);
                } else {
                  // Handling object as a simple value if callback returned false.
                  handleValue(key, value);
                }

              } else {
                // Iterating an object if no callback function is present.
                self.iterate(object[key]);
              }

            } else {
              handleValue(key, value);
            }
          }
        }
      };
    }
  })
;
