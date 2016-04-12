
const fruitsData = [
  {
    name: 'Mango'
  },
  {
    name: 'Papaya'
  },
  {
    name: 'Maracuya'
  }
];

const _ = require('lodash');
const Promise = require('bluebird');


module.exports = {

  fruits: function () {

    var Fruit = app.models.Fruit;

    return app.sequelize.transaction(function (transaction) {
      return Promise.all(_.map(fruitsData, function (fruitData) {
        return Fruit
          .count({
            where: {
              name: fruitData.name
            }
          })
          .then(function (count) {
            if (count > 0) {
              return;
            }
            return Fruit.create(fruitData);
          })
        ;
      }));
    });

  }

};
