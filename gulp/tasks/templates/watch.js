
module.exports = function (gulp) {
  gulp.watch(SRC_PATH + '/templates/**/*.html', ['templates:build'], callback);
};
