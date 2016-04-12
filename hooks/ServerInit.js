
var Promise = require('bluebird');
var restify = require('restify');
var restifyCookies = require('restify-cookies');

/**
 * AFTER: Logging
 */
module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      // Creating a server.
      var server = restify.createServer({
        log: app.log
      });

      server.pre(restify.pre.sanitizePath());

      // Request logger.
      server.use(restify.requestLogger());

      // Setting general headers.
      server.use(function (req, res, next) {
        res.setHeader('Server', app.config.http.serverIdentity + '/' + app.package.version);
        next();
      });

      // CORS.
      if (app.config.cors && app.config.cors.enabled) {
        var corsConfig = {};
        if (app.config.cors.origins) {
          corsConfig.origins = app.config.cors.origins;
        }
        if (app.config.cors.allowCredentials) {
          corsConfig.credentials = app.config.cors.allowCredentials;
        }
        app.log.debug(
          'CORS is enabled: ' + JSON.stringify(corsConfig)
        );
        server.use(restify.CORS(corsConfig));
      }

      // Query parser.
      server.use(restify.queryParser({
        mapParams: false
      }));

      // Body parser.
      server.use(restify.bodyParser({
        mapParams: false
      }));

      // Cookies.
      server.use(restifyCookies.parse);

      server.on('uncaughtException', function (req, res, route, error) {
        req.log.error('Exception', error);
        res.send(error);
      });

      global.app.server = server;

      resolve();

    })
  }
};
