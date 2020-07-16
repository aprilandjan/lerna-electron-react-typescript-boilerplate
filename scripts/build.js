const fs = require('fs-extra');
const path = require('path');
const findLernaPackages = require('find-lerna-packages');
const run = require('./utils/run');

//  FIXME: build should be sequenced. use gulp instead?
(async () => {
  await run('app-renderer', 'build', false);
  await run('app-main', 'build', false);

  //  copy renderer dist into main dist
  const main = findLernaPackages.getSync('app-main').location;
  const mainDist = path.join(main, 'dist');
  const renderer = findLernaPackages.getSync('app-renderer').location;
  const rendererDist = path.join(renderer, 'dist');
  fs.copySync(rendererDist, mainDist);
  fs.copySync(path.join(main, 'index.html'), path.join(mainDist, 'index.html'));
})();
