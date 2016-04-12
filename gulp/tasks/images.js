
module.exports = function (gulp) {
  return gulp.src(SRC_PATH + '/images/**/*')
    .pipe(gulp.dest(TARGET_PATH + '/images/'))
  ;
};
