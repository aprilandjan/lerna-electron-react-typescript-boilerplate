const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const findLernaPackages = require('find-lerna-packages');

const pkgList = findLernaPackages.sync();
const main = pkgList.find(pkg => pkg.name === 'app-main');
const rest = pkgList.filter(pkg => pkg !== main);

/**
 * format electron-builder files patterns, see https://www.electron.build/configuration/contents
 * the electron-builder file pattern is really confusing...
 * seems to be relatively in bundled app directory
 * @param {*} p
 * @param {*} pkgBase
 */
function getFormattedFilePattern(p, pkgName) {
  let negative = p.startsWith('!');
  let rest = negative ? p.substr(1) : p;
  const pattern = path.join('**/node_modules/', pkgName, rest);
  return negative ? '!' + pattern : pattern;
}

/** get all extra defined files */
function getExtraFiles(platform) {
  const totalFiles = rest.reduce((list, pkg) => {
    const conf = pkg.get('electron-builder') || {};
    let files = [...(conf.files || []), ...((conf[platform] || {}).files || [])];
    files = files.map(p => {
      return getFormattedFilePattern(p, pkg.name);
    });
    return [...list, ...files];
  }, []);

  return totalFiles.filter(Boolean);
}

/**
 * build package through mac/win
 *
 * @param {*} platform mac/win
 * @param {*} args the rest of electron builder cli arguments('--win'/'--mac' not included)
 */
module.exports = function(platform, args) {
  // https://gist.github.com/akaJes/331371ba5ac1df18b22c0531b03dc847
  const config = main.get('build');
  const extraFiles = getExtraFiles(platform);

  if (!config.files) {
    config.files = [];
  }
  config.files = [...config.files, ...extraFiles];

  //  write to local file
  const dir = path.join(process.cwd(), './node_modules/.cache/dev-utils');
  fs.mkdirpSync(dir);
  const tempFile = path.join(dir, 'electron-builder.json');
  fs.writeFileSync(tempFile, JSON.stringify(config, null, 2), 'utf8');

  // https://www.electron.build/configuration/configuration
  return execa(
    'electron-builder',
    ['--config', tempFile, platform === 'mac' ? '--mac' : '--win', ...args],
    {
      preferLocal: true,
      localDir: path.join(__dirname, '../../'),
      stdio: 'inherit',
    }
  );
};
