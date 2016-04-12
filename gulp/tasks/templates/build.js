
module.exports = function (gulp) {
  return gulp.src(SRC_PATH + '/templates/**/*.html')
    .pipe(gulp.dest(TARGET_PATH + '/templates'))
  ;
};
