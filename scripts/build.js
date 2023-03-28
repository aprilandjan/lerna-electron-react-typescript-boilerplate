const fs = require('fs-extra');
const path = require('path');
const findLernaPackages = require('find-lerna-packages');
const run = require('./utils/run');

(async () => {
  await run('build-modules');
  await run('app-common', 'build');
  await run('app-worker', 'build');
  await run('app-renderer', 'build');
  await run('app-main', 'build');

  //  copy renderer dist into main dist
  console.log('copy dist assets...');
  const main = findLernaPackages.getSync('app-main').location;
  const mainDist = path.join(main, 'dist');
  const renderer = findLernaPackages.getSync('app-renderer').location;
  const rendererDist = path.join(renderer, 'dist');
  fs.copySync(rendererDist, mainDist);
  fs.copySync(path.join(main, 'index.html'), path.join(mainDist, 'index.html'));
  console.log('copy dist assets done!');
})();
