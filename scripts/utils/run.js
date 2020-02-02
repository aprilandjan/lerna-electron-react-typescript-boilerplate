// const path = require('path');
const { spawn } = require('child_process');
const resolvePackage = require('./resolvePackage');

module.exports = function run(packageName, cmd, bail = true) {
  return new Promise((resolve, reject) => {
    const cp = spawn('yarn', [cmd], {
      cwd: resolvePackage(packageName),
      stdio: 'inherit',
    });
    cp.on('exit', (code, signal) => {
      // console.log('exit', code, signal);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} in ${packageName} failed in code ${code}`));
        //  if bail(allow failure), the current process won't exit automatically
        if (!bail) {
          process.exit(signal);
        }
      }
    });
  });
};
