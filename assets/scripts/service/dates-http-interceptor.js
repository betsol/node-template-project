
'use strict';

var angular = require('angularjs');

var MODULE_NAME = 'app.service.datesHttpInterceptor';

module.exports = MODULE_NAME;


angular
  .module(MODULE_NAME, [
    require('./dates-converter.js')
  ])
  .factory('datesHttpInterceptor', function (
    DatesConverter
  ) {

    var fromStringToDateConverter = new DatesConverter('object');
    //var fromDateToStringConverter = new DatesConverter('string');

    return {
      //request: function (request) {
      //  console.log('Request intercepted', request);
      //  return request;
      //},
      response: function (response) {
        if ('object' === typeof response.data) {
          fromStringToDateConverter.convertRecursively(response.data);
        }
        return response;
      }
    };
  })
;
