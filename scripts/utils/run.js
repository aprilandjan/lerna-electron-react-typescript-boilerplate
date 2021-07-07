const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const findLernaPackages = require('find-lerna-packages');
const treeKill = require('tree-kill');

function runPkgScript(pkg, cmd, allowFailure = false) {
  // https://github.com/yarnpkg/yarn/issues/4667
  return new Promise((resolve, reject) => {
    const pkgLocation = pkg.location;
    const script = pkg.scripts[cmd];
    if (!script) {
      reject(new Error(`Cannot find ${cmd} in ${pkg}`));
      return;
    }
    const args = script.split(' ');
    const binName = args.shift();
    const binPath = path.join(pkg.binLocation, binName);
    let cp;
    if (fs.existsSync(binPath)) {
      //  binPath exists, run as node script to skip prevent shell options
      cp = execa(binName, args, {
        cwd: pkgLocation,
        stdio: 'inherit',
      });
    } else {
      //  binPath not exits, run as normal yarn task
      cp = execa('yarn', [cmd], {
        cwd: pkgLocation,
        stdio: 'inherit',
      });
    }
    cp.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        console.error(`[${pkg.name}: ${cmd}] exit unexpected with code ${code}`);
        if (allowFailure) {
          resolve();
        } else {
          treeKill(process.pid);
        }
      }
    });
  });
}

module.exports = function(...args) {
  if (
    (args.length === 1 && typeof args[0] === 'string') ||
    (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'boolean')
  ) {
    // run('dev'), run('dev', true)
    // will run current root's npm script
    const root = findLernaPackages.getRoot();
    return runPkgScript(root, ...args);
  }
  //  run('app-common', 'dev'), run('app-common', 'dev', true)
  //  will run sub package's num script
  const [name, ...rest] = args;
  const pkg = findLernaPackages.getSync(name);
  return runPkgScript(pkg, ...rest);
};
