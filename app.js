
var requireDirectory = require('require-directory');
var Promise = require('bluebird');
var _ = require('lodash');
var path = require('path');
var minimist = require('minimist');


// Creating global reference to the application object.
global.app = {};

app.package = require('./package.json');

app.rootPath = __dirname;

app.config = requireDirectory(module, './config');

app.cliArgs = minimist(process.argv.slice(2), app.config.cli.minimistConfig);

app.environment = (app.cliArgs.environment || process.env.NODE_ENV || 'development');

app.middleware = requireDirectory(module, './middleware');

// Log messages will be temporarily stored here until logging hook is run.
app.logQueue = [
  ['info', 'Running application in «' + app.environment + '» environment']
];

// Starting initialization queue.
var queue = Promise.resolve();

// Running hooks.
var hookRunner = require(path.join(app.rootPath, 'services/Framework/HookRunner.js'));
queue = queue.then(function () {
  return hookRunner
    .run()
    .then(function () {
      app.log.debug('Project initialized');
    })
  ;
});

// Running command.
queue = queue.then(function () {
  if (app.cliArgs.command) {
    var commandModules = requireDirectory(module, path.join(app.rootPath, 'commands/'));
    var commandFunc = _.get(commandModules, app.cliArgs.command);
    if (_.isFunction(commandFunc)) {
      app.log.info('Running command: «' + app.cliArgs.command + '»');
      return commandFunc();
    } else {
      app.log.error('Invalid command: «' + app.cliArgs.command + '»');
    }
  }
});

// REPL mode.
queue = queue.then(function () {
  if (app.cliArgs.console) {
    app.log.info('Starting REPL console');
    var nesh = require('nesh');
    // Start the REPL.
    nesh.start({
      prompt: ' > '
    }, function (err) {
      if (err) {
        nesh.log.error(err);
      }
    });
  }
});
