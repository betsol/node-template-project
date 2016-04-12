
'use strict';

var angular = require('angularjs');
var deferredBootstrapper = require('angular-deferred-bootstrap');

var MODULE_NAME = 'app';


/**
 * MAIN APPLICATION MODULE
 */
angular
  .module(MODULE_NAME, [

    // GLOBAL THIRD-PARTY MODULES
    require('angular-loading-bar'),
    require('betsol-ng-networking'),

    // SERVICES
    require('./service/dates-http-interceptor.js'),

    // FEATURES
    require('./feature/router'),

    // SECTIONS
    require('./section/index')

  ])

  .constant('CONFIG', {
    apiEndpoint: '/api'
  })

  .config(function (
    $httpProvider,
    cfpLoadingBarProvider,
    $compileProvider,
    networkingProvider,
    CONFIG
  ) {

    $httpProvider.interceptors.push('datesHttpInterceptor');

    cfpLoadingBarProvider.latencyThreshold = 0;

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|skype|tel):/);

    networkingProvider.setBaseUrl(CONFIG.apiEndpoint);

  })

;

/**
 * BOOTSTRAP MODULE
 */
deferredBootstrapper.bootstrap({
  element: document.body,
  module: MODULE_NAME
});
