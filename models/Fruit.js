
var Sequelize = require('sequelize');
var _ = require('lodash');


module.exports = {
  attributes: {
    name: {
      type: Sequelize.STRING(32),
      allowNull: false
    }
  },

  associations: [
  ],

  options: {
    instanceMethods: {
      serialize: function (req) {
        return _.pick(this, [
          'id', 'name'
        ]);
      }
    }
  }

};
