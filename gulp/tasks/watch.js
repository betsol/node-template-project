
const gulpLivereload = require('gulp-livereload');
const runSequence = require('run-sequence');


module.exports = function (gulp, callback) {
  gulpLivereload.listen();
  runSequence([
    'watch:styles',
    'watch:templates'
  ], callback);
};
