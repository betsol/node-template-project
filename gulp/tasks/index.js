
module.exports = function (gulp) {
  return gulp.src(SRC_PATH + '/application.html')
    .pipe(gulp.dest(TARGET_PATH))
  ;
};
