
var Promise = require('bluebird');
var requireDirectory = require('require-directory');
var path = require('path');


module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      app.services = requireDirectory(module, path.join(app.rootPath, 'services/'));

      resolve();

    })
  }
};
