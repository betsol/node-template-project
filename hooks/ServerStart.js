
var Promise = require('bluebird');


/**
 * AFTER: Logging, ServerInit
 */
module.exports = {
  run: function () {
    return new Promise(function (resolve, reject) {

      // Starting the server.
      app.server.listen(app.config.http.port, function () {
        app.log.info('Server is now listening on port: ' + app.config.http.port);
        resolve();
      });

    })
  }
};
