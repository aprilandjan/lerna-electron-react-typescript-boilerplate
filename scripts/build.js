const fs = require('fs-extra');
const path = require('path');
const resolvePackage = require('./utils/resolvePackage');
const run = require('./utils/run');

//  FIXME: build should be sequenced. use gulp instead?
(async () => {
  await run('app-renderer', 'build', false);
  await run('app-main', 'build', false);

  //  copy renderer dist into main dist
  const main = resolvePackage('app-main').location;
  const mainDist = path.join(main, 'dist');
  const renderer = resolvePackage('app-renderer').location;
  const rendererDist = path.join(renderer, 'dist');
  fs.copySync(rendererDist, mainDist);
  fs.copySync(path.join(main, 'index.html'), path.join(mainDist, 'index.html'));
})();
