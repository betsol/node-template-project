'use strict';

var angular = require('angularjs');

var MODULE_NAME = 'app.feature.router';
var NOT_FOUND_URL = '/404';

module.exports = MODULE_NAME;


angular
  .module(MODULE_NAME, [
    require('angular-ui-router'),
    require('angular-ui-router.statehelper')
  ])
  .config(function (
    $locationProvider,
    stateHelperProvider,
    $urlRouterProvider
  ) {

    // Enabling HTML5 URL.
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
      rewriteLinks: false
    });

    stateHelperProvider
      .state({
        name: '$',
        abstract: true,
        children: [
          {
            name: 'not-found',
            url: NOT_FOUND_URL,
            views: {
              'main@': {
                templateUrl: '/templates/sections/not-found.html'
              }
            }
          }
        ]
      })
    ;

    $urlRouterProvider.otherwise(NOT_FOUND_URL);

  })

;
