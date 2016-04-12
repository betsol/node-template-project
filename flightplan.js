
//==============//
// DEPENDENCIES //
//==============//

var pkg = require('./package.json');
var plan = require('flightplan');
var _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var path = require('path');


//=========//
// GLOBALS //
//=========//

var tempPath;
var timeString = String(new Date().getTime());


//==================//
// DEFINING TARGETS //
//==================//

if (!pkg.deployment) {
  return console.log('Missing deployment configuration');
}

if (!pkg.deployment.servers) {
  return console.log('Missing server list from deployment configuration');
}

_.forEach(pkg.deployment.servers, function (server) {
  if (!server.enabled) {
    return;
  }
  var definition = {
    tryKeyboard: true,
    agent: process.env.SSH_AUTH_SOCK
  };
  _.extend(definition, _.pick(server, ['host', 'port', 'username']));
  plan.target(server.name, definition);
});


//=======//
// LOCAL //
//=======//

plan.local(function (local) {

  // Asking user to update project version.
  handleReleaseVersion(local);

  // Re-loading the package information (version could've changed).
  pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

  local.log('Building the project...');
  buildProject(local);

  local.log('Copying files to remote hosts');
  tempPath = '/tmp/' + pkg.name + '-' + pkg.version + '-' + timeString;

  var fileGroups = [
    pkg.deployment.files
  ];

  _.forEach(pkg.deployment.directories, function (path) {
    fileGroups.push(
      exec(local, 'find ' + path + ' -type f', {silent: true})
        .stdout
        .split('\n')
    );
  });

  local.transfer(
    _.union.apply(_, fileGroups),
    tempPath
  );

});


//========//
// REMOTE //
//========//

plan.remote(function (remote) {

  var basePath = pkg.deployment.remotePath;
  var releasePath = basePath + '/releases/' + pkg.version;
  var publicPath = basePath + '/current';

  // Deleting target directory if it exists.
  remote.exec('rm -rf ' + releasePath);

  remote.log('Moving project files to web root');
  remote.exec('cp -R ' + tempPath + ' ' + releasePath);

  remote.log('Installing Node dependencies');
  remote.exec('cd ' + releasePath + ' && npm i --production');

  remote.log('Deleting temporary files');
  remote.exec('rm -rf ' + tempPath);

  remote.log('Creating log directory');
  remote.exec('mkdir -p ' + path.join(releasePath, '/var/logs/'));

  remote.log('Creating a symlink');
  remote.exec('ln -sfn ' + releasePath + ' ' + publicPath);

  remote.log('Restarting the application');
  remote.exec('sudo pm2 restart ' + pkg.name, {silent: true});

});


//===========//
// FUNCTIONS //
//===========//

/**
 * Builds the project files.
 *
 * @param {Object} transport
 */
function buildProject (transport) {
  var optionsStr = '';
  if ('production' == plan.runtime.target) {
    optionsStr += '--env=production ';
  }
  transport.exec('gulp ' + optionsStr);
}

/**
 * Asks user whether to bump project version and does so if confirmed.
 *
 * @param {Object} transport
 */
function handleReleaseVersion (transport) {

  var cancelOption = 'no';
  var defaultOption = 'no';
  var options = ['major', 'minor', 'patch', defaultOption];
  var question = 'Would you like to bump the version?';

  var option = promptOption(transport, question, options, defaultOption);

  if (option != cancelOption) {
    transport.exec('npm version ' + option + ' -m "Release %s"');
  }
}

/**
 * Asks user to select one of the provided options.
 *
 * @param {Object} transport
 * @param {string} question
 * @param {Array} options
 * @param {*} defaultOption
 *
 * @returns {*}
 */
function promptOption (
  transport,
  question,
  options,
  defaultOption
) {

  while (true) {

    // Asking user for option.
    var option = transport.prompt(
      question + "\n" +
      '(' + options.join('/') + ') ' +
      '[' + defaultOption + ']' + "\n"
    ).trim();

    // Falling back to default option if necessary.
    if ('' === option) {
      option = defaultOption;
    }

    // Handling unknown options.
    if (-1 === options.indexOf(option)) {
      transport.log('Unknown option specified: "' + option + '"!');
      continue;
    }

    // Returning selected option.
    return option;
  }
}

/**
 * Custom exec with bigger buffer.
 *
 * @param transport
 * @param command
 * @param options
 *
 * @returns {*}
 */
function exec (transport, command, options) {
  options.exec = {
    maxBuffer: 10 * 1024 * 1024
  };
  return transport.exec(command, options);
}
