// const path = require('path');
const spawn = require('cross-spawn');
const path = require('path');
const fs = require('fs-extra');
const findLernaPackages = require('find-lerna-packages');

const children = [];
process.on('exit', () => {
  children.forEach(([name, child]) => {
    child.kill();
  });
});

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
    //  简单的判断下 bin
    const args = script.split(' ');
    const binName = args.shift();
    const binPath = path.join(pkg.binLocation, binName + '.js');
    //  是 bin 任务，用 node 去执行
    let cp;
    if (fs.existsSync(binPath)) {
      cp = spawn('node', [binPath, ...args], {
        cwd: pkgLocation,
        stdio: 'inherit',
      });
    } else {
      //  不是 bin 任务，用 yarn 去执行
      cp = spawn('yarn', [cmd], {
        cwd: pkgLocation,
        stdio: 'inherit',
      });
    }
    const child = [`${packageName}:${cmd}`, cp];
    children.push(child);
    cp.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        if (!allowFailure) {
          children.splice(children.indexOf(child), 1);
          if (children.length) {
            //  通知其他进程退出
            children.forEach(item => {
              item[1].kill();
            });
          } else {
            process.exit(1);
          }
          reject(new Error(`${cmd} in ${packageName} failed in code ${code}`));
        } else {
          console.error(`${packageName}: ${cmd} failed! continue since allowFailure = true`);
          resolve();
        }
      }
    });
  });
};
