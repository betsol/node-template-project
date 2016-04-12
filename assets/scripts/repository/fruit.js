'use strict';

var angular = require('angularjs');

var MODULE_NAME = 'app.repository.fruit';

module.exports = MODULE_NAME;

angular
  .module(MODULE_NAME, [
    require('betsol-ng-repository'),
    require('betsol-ng-networking')
  ])
  .factory('fruitRepository', function (
    $q,
    Repository
  ) {

    var repository = new Repository('fruits');

    // @todo: extend repository with additional methods as you see fit.

    return repository;

  })
;
