
var _ = require('lodash');


var defaultOptions = {
  path: 'query',
  map: {}
};


module.exports = pickDataFromRequest;


function pickDataFromRequest (req, options) {
  options = _.extend({}, defaultOptions, options);
  var data = {};
  _.forEach(options.map, function (field, fieldName) {
    var path = (field.path || options.path);
    var parts = path.split('.');
    if (1 == parts.length) {
      path += '.' + fieldName;
    }
    var value = _.get(req, path, undefined);
    if (undefined === value) {
      return;
    }
    if (!value) {
      value = null;
    }
    field.type = field.type || 'string';
    switch (field.type) {
      case 'boolean':
      case 'bool':
        data[fieldName] = (parseInt(value) > 0);
        break;
      case 'string':
      default:
        data[fieldName] = value;
    }

  });
  return data;
}
