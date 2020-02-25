const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const resolvePackage = require('./resolvePackage');

const children = [];
process.on('exit', function() {
  children.forEach(function([name, child]) {
    child.kill('SIGINT');
  });
});

/** 如果 allowFailure 则允许失败 */
module.exports = function run(packageName, cmd, allowFailure = false) {
  // https://github.com/yarnpkg/yarn/issues/4667
  return new Promise((resolve, reject) => {
    //  从 node_modules/.bin/ 中找到该文件
    const cwd = resolvePackage(packageName);
    const pkg = require(path.join(cwd, 'package.json'));
    const script = pkg.scripts[cmd];
    if (!script) {
      reject(new Error(`Cannot find ${cmd} in ${packageName}`));
      return;
    }
    //  简单的判断下 bin
    const args = script.split(' ');
    const binName = args.shift();
    const binPath = path.join(cwd, 'node_modules/.bin', binName);
    //  是 bin 任务，用 node 去执行
    let cp;
    if (fs.existsSync(binPath)) {
      cp = spawn('node', [binPath, ...args], {
        cwd: resolvePackage(packageName),
        stdio: 'inherit',
      });
    } else {
      //  不是 bin 任务，用 yarn 去执行
      cp = spawn('node', [cmd], {
        cwd,
        stdio: 'inherit',
      });
    }
    cp.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        if (!allowFailure) {
          reject(new Error(`${cmd} in ${packageName} failed in code ${code}`));
          process.exit(code);
        } else {
          console.error(`${packageName}: ${cmd} failed! continue since allowFailure = true`);
          resolve();
        }
      }
    });
    children.push([`${packageName}:${cmd}`, cp]);
  });
};
