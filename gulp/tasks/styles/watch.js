
module.exports = function (gulp) {
  gulp.watch(SRC_PATH + '/styles/**/*.pcss', ['styles:build'], callback);
};
