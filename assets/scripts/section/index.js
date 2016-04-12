
'use strict';

var angular = require('angularjs');

var MODULE_NAME = 'app.section.index';

module.exports = MODULE_NAME;


angular
  .module(MODULE_NAME, [
    require('angular-ui-router.statehelper'),
    require('../repository/fruit')
  ])

  .config(function (
    stateHelperProvider
  ) {

    stateHelperProvider
      .state({
        parent: '$',
        name: 'index',
        url: '/',
        views: {
          'main@': {
            templateUrl: '/templates/sections/index.html',
            controller: 'IndexCtrl',
            controllerAs: 'vm'
          }
        },
        resolve: {
          fruits: function (fruitRepository) {
            return fruitRepository.find();
          }
        }
      })
    ;

  })

  .controller('IndexCtrl', function (fruits) {
    var vm = this;
    vm.fruits = fruits;
  })

;
