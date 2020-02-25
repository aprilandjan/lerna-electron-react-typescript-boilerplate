const detect = require('detect-port-alt');

const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');
const logger = require('./logger');

var execOptions = {
  encoding: 'utf8',
  stdio: [
    'pipe', // stdin (default)
    'pipe', // stdout (default)
    'ignore', //stderr
  ],
};

function getProcessIdOnPort(port) {
  return execSync('lsof -i:' + port + ' -P -t -sTCP:LISTEN', execOptions)
    .split('\n')[0]
    .trim();
}

function getProcessCommand(processId, processDirectory) {
  var command = execSync('ps -o command -p ' + processId + ' | sed -n 2p', execOptions);

  command = command.replace(/\n$/, '');
  return command;
}

function getDirectoryOfProcessById(processId) {
  return execSync(
    'lsof -p ' + processId + ' | awk \'$4=="cwd" {for (i=9; i<=NF; i++) printf "%s ", $i}\'',
    execOptions
  ).trim();
}

function getProcessForPort(port) {
  try {
    var processId = getProcessIdOnPort(port);
    var directory = getDirectoryOfProcessById(processId);
    var command = getProcessCommand(processId, directory);
    return (
      chalk.cyan(command) +
      chalk.grey(' (pid ' + processId + ')\n') +
      chalk.blue('  in ') +
      chalk.cyan(directory)
    );
  } catch (e) {
    return null;
  }
}

module.exports = function(defaultPort, host) {
  return detect(defaultPort, host).then(
    port =>
      new Promise((resolve, reject) => {
        if (String(port) === String(defaultPort)) {
          return resolve(port);
        }
        const message =
          process.platform !== 'win32' && defaultPort < 1024
            ? `Admin permissions are required to run a server on a port below 1024.`
            : `Something is already running on port ${defaultPort}.`;

        console.log(chalk.red(message));
        const existingProcess = getProcessForPort(defaultPort);
        if (existingProcess) {
          logger.info(`Probably:\n ${existingProcess}`);
        }
        return reject(new Error('port is not available'));
      }),
    err => {
      throw new Error(
        chalk.red(`Could not find an open port at ${chalk.bold(host)}.`) +
          '\n' +
          ('Network error message: ' + err.message || err) +
          '\n'
      );
    }
  );
};
