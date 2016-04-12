
// Globals.
global.SRC_PATH = __dirname + '/assets';
global.TARGET_PATH = __dirname + '/.public';
global.dist = false;

const minimist = require('minimist');
const gulpRequireTasks = require('gulp-require-tasks');
const gulp = require('gulp');
const runSequence = require('run-sequence');


// Parsing CLI arguments.
var cliArgs = minimist(process.argv.slice(2), {
  string: 'env',
  default: {
    env: (process.env.NODE_ENV || 'development')
  }
});
dist = (cliArgs.env === 'production');

// Loading gulp tasks from directory.
gulpRequireTasks({
  path: __dirname + '/gulp/tasks/'
});

// Default task.
gulp.task('default', function(callback) {
  runSequence(
    'clean',
    ['images', 'templates:build', 'styles:build', 'scripts'],
    'index',
    callback
  );
});
