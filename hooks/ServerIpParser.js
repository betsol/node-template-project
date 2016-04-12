
var Promise = require('bluebird');
var ipWare = require('ipware')().get_ip;


/**
 * AFTER: ServerInit
 */
module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      /**
       * Parsing IP address from request.
       *
       * `req.clientIP`         holds the client's IP address
       * 'req.clientIpRoutable` is `true` if user's IP is `public`. (externally route-able)
       */
      app.server.use(function (req, res, next) {
        ipWare(req);
        next();
      });

      resolve();

    })
  }
};
