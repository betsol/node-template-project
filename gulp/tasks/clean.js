
const del = require('del');


module.exports = function (gulp) {
  return del(TARGET_PATH + '/*');
};
