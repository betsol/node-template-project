
const gulpPostcss = require('gulp-postcss');
const postcssPartialImport = require('postcss-partial-import');
const postcssCssnext = require('postcss-cssnext');
const gulpRename = require('gulp-rename');
const gulpLivereload = require('gulp-livereload');


/**
 * @todo: implement resource minification!
 */
module.exports = function (gulp) {
  var processors = [
    postcssPartialImport({
      extension: 'pcss'
    }),
    postcssCssnext
  ];
  return gulp.src(SRC_PATH + '/styles/*.pcss')
    .pipe(gulpPostcss(processors))
    .pipe(gulpRename(function(filePath) {
      filePath.extname = '.css';
    }))
    .pipe(gulp.dest(TARGET_PATH + '/css'))
    .pipe(gulpLivereload())
  ;
};
