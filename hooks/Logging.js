
var Promise = require('bluebird');
var pathModule = require('path');
var bunyan = require('bunyan');
var _ = require('lodash');


module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      var streams = [
        {
          level: ('production' == app.environment ? 'info' : 'debug'),
          stream: process.stdout
        },
        {
          level: 'error',
          path: pathModule.join(app.rootPath, '/var/error.log')
        }
      ];

      // Logentries support.
      if (app.config.log.logentries && app.config.log.logentries.enabled) {
        if (app.environment == app.config.log.logentries.environment || 'any' == app.config.log.logentries.environment) {
          streams.push({
            level: app.config.log.logentries.level,
            stream: require('logentries-stream')(app.config.log.logentries.token)
          });
        }
      }

      // Creating logger.
      app.log = bunyan.createLogger({
        name: app.package.name,
        streams: streams
      });

      // Logging messages from the queue.
      _.forEach(app.logQueue, function (logEntry) {
        app.log[logEntry[0]](logEntry[1]);
      });
      delete app.logQueue;

      resolve();

    })
  }
};
