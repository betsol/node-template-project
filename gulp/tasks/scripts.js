
var path = require('path');
var foreach = require('gulp-foreach');
var jshint = require('gulp-jshint');
var named = require('vinyl-named');
var webpack = require('webpack-stream');
var gulpif = require('gulp-if');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');


module.exports = function (gulp) {
  var scriptsDir = SRC_PATH + '/scripts';
  var webpackConfig = {};
  if (!dist) {
    webpackConfig.devtool = 'inline-source-map';
  }
  return gulp
    .src([
      // Specify all source scripts that need to be processed.
      scriptsDir + '/*.js'
    ])
    // Splitting each file into it's separate stream.
    .pipe(foreach(function (stream, file) {
      var relativePath = path.dirname(path.relative(scriptsDir, file.path));
      return stream
        .pipe(jshint({
          predef: [
            'module',
            'require',
            'window',
            'document',
            'console'
          ],
          strict: 'global'
        }))
        .pipe(jshint.reporter('default'))
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(ngAnnotate({
          single_quotes: true
        }))
        .pipe(gulpif(dist, uglify()))
        .pipe(gulp.dest(path.join(TARGET_PATH, 'js', relativePath)))
      ;
    }))
  ;
};
