const spawn = require('cross-spawn');
const logger = require('./logger');

/** { cmd, script } */
module.exports = function run (map) {
  const args = process.argv.slice(2);
  const cmdList = Object.keys(map);
  const cmdIndex = args.findIndex(
    x => cmdList.includes(x),
  );
  const cmd = cmdIndex === -1 ? args[0] : args[cmdIndex];
  const nodeArgs = cmdIndex > 0 ? args.slice(0, cmdIndex) : [];

  if (cmdList.includes(cmd)) {
    const result = spawn.sync(
      'node',
      nodeArgs
        .concat(map[cmd])
        .concat(args.slice(cmdIndex + 1)),
      {
        stdio: 'inherit'
      }
    );
    if (result.signal) {
      if (result.signal === 'SIGKILL') {
        logger.info(
          'The build failed because the process exited too early. ' +
            'This probably means the system ran out of memory or someone called ' +
            '`kill -9` on the process.'
        );
      } else if (result.signal === 'SIGTERM') {
        logger.info(
          'The build failed because the process exited too early. ' +
            'Someone might have called `kill` or `killall`, or the system could ' +
            'be shutting down.'
        );
      }
      process.exit(1);
    }
    process.exit(result.status);
  } else {
    logger.info('Unknown command "' + cmd + '".');
  }
}
