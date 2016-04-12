
const _ = require('lodash');


module.exports = {
  handler: function (req, res) {
    return app.models.Fruit
      .findAll()
      .then(function (fruits) {
        return _.map(fruits, function (fruit) {
          return fruit.serialize(req);
        });
      })
    ;
  }
};
