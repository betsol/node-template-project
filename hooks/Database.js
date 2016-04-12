
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const requireDirectory = require('require-directory');
const path = require('path');
const _ = require('lodash');
const changeCase = require('change-case');
const cls = require('continuation-local-storage');

Sequelize.cls = cls.createNamespace(app.package.name + '-application');


const DEFAULT_CONFIG = {
  database: 'database',
  username: 'postgres',
  password: '',
  dialect: 'postgres',
  sync: true
};


/**
 * AFTER: [Logging]
 */
module.exports = {

  run: function () {
    return new Promise(function (resolve, reject) {

      var config = _.extend({}, DEFAULT_CONFIG, app.config.database || {});

      global.app.models = {};

      // Establishing a connection.
      var sequelize = new Sequelize(
        config.database,
        config.username,
        config.password, {
          dialect: config.dialect,
          define: {
            // Global methods for all models.
            instanceMethods: {
              extend: function (data) {
                return _.extend(this, data);
              }
            }
          }
        }
      );

      // Defining models.
      var models = requireDirectory(module, path.join(app.rootPath, '/models/'));
      _.forEach(models, function (modelDef, fileName) {
        var modelName = changeCase.camelCase(fileName);
        global.app.models[fileName] = sequelize.define(modelName, modelDef.attributes, modelDef.options);
        if (app.log) {
          app.log.debug('Model defined: ' + fileName);
        }
      });

      // Defining associations between models.
      _.forEach(models, function (modelDef, modelName) {
        if (modelDef.associations) {
          var Model = app.models[modelName];
          _.forEach(modelDef.associations, function (assDef) {
            var assType = assDef.type;
            var TargetModel = app.models[assDef.target];
            assDef.options = assDef.options || {};
            Model[assType](TargetModel, assDef.options);
            if (app.log) {
              app.log.debug(
                'Defined "' + assType +
                '" association on model "' + modelName +
                '" to model "' + assDef.target + '"'
              );
            }
          });
        }
      });

      global.app.sequelize = sequelize;

      // Synchronizing schema.
      if (config.sync) {
        sequelize
          .sync()
          .then(function () {
            if (app.log) {
              app.log.debug('Database schema synchronized');
            }
            resolve();
          })
        ;
      } else {
        app.log.debug('Database schema synchronization disabled');
        resolve();
      }

    })
  }

};
