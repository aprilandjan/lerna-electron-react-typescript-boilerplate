const execa = require('execa');
const findLernaPackages = require('find-lerna-packages');

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
    //  the execa automatically helps find bin & process dies
    let cp = execa(bin, args, {
      cwd: pkgLocation,
      stdio: 'inherit',
    });
    cp.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        if (allowFailure) {
          reject(new Error(`${cmd} in ${packageName} failed in code ${code}`));
          process.exit(1);
        } else {
          console.error(`${packageName}: ${cmd} failed! continue since allowFailure = true`);
          resolve();
        }
      }
    });
  });
};
