

var path = require('path');
var _ = require('lodash');
var Promise = require('bluebird');


module.exports = {
  run: function () {

    // Loading hook modules from filesystem.
    //var hookModules = requireDirectory(module, path.join(app.rootPath, 'hooks/'));

    // Creating a promise «queue» for hooks.
    var queue = Promise.resolve();

    _.forEach(app.config.hooks, function (hookDefinition) {

      hookDefinition = normalizeHookDefinition(hookDefinition);

      // Skipping hook execution if it's marked as «server» and user asked not to run server.
      var skipHook = (hookDefinition.server && app.cliArgs.noServer);

      queue = queue.then(function () {
        if (!skipHook) {

          // Loading hook module from filesystem.
          var hookModule = require(path.join(app.rootPath, 'hooks/' + hookDefinition.name + '.js'));

          log('debug', 'Running hook: ' + hookDefinition.name);

          // Running hook.
          return hookModule.run();

        } else {
          log('debug', 'Skipping server hook: ' + hookDefinition.name);
          return Promise.resolve();
        }
      });

    });

    return queue;

  }
};


function normalizeHookDefinition (hookDefinition) {
  if (_.isString(hookDefinition)) {
    hookDefinition = {
      name: hookDefinition
    };
  }
  return hookDefinition;
}

function log (level, message) {
  if (global.app.log) {
    global.app.log[level](message);
  } else {
    app.logQueue.push([level, message]);
  }
}
