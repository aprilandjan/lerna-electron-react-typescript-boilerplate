const execa = require('execa');
const findLernaPackages = require('find-lerna-packages');
const treeKill = require('tree-kill');

/** 如果 allowFailure 则允许失败 */
module.exports = function run(packageName, cmd, allowFailure = false) {
  // https://github.com/yarnpkg/yarn/issues/4667
  return new Promise((resolve, reject) => {
    const pkg = findLernaPackages.getSync(packageName);
    const pkgLocation = pkg.location;
    const script = pkg.scripts[cmd];
    if (!script) {
      reject(new Error(`Cannot find ${cmd} in ${packageName}`));
      return;
    }
    const args = script.split(' ');
    const bin = args.shift();
    //  the execa automatically helps find bins
    let cp = execa(bin, args, {
      cwd: pkgLocation,
      stdio: 'inherit',
    });
    cp.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        console.error(`[${packageName}: ${cmd}] exit unexpected with code ${code}`);
        if (allowFailure) {
          resolve();
        } else {
          treeKill(process.pid);
        }
      }
    });
  });
};
