const path = require('path');
const { spawn } = require('child_process');

module.exports = function run(packageName, cmd, bail = true) {
  const cp = spawn('yarn', [cmd], {
    cwd: path.join(__dirname, '../../packages', packageName),
    stdio: 'inherit',
  });
  //  if bail(allow failure), the current process won't exit automatically
  if (!bail) {
    cp.on('exit', (signal) => {
      console.log('signal', signal);
      process.exit(signal);
    });
  }
}
