
module.exports = {
  before: {
    'Framework.Request.input': {
      fields: {
        id: {
          path: 'params',
          required: true,
          validate: {
            isInt: [{
              min: 1
            }]
          }
        }
      }
    }
  },
  handler: function (req, res) {
    return app.models.Fruit
      .findOne({
        where: {
          id: req.data.id
        }
      })
      .then(function (fruit) {
        if (!fruit) {
          app.throw('NotFound');
        }
        return fruit.serialize(req);
      })
    ;
  }
};
