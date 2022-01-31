const fs = require('fs-extra');
const path = require('path');
const builder = require('electron-builder');
const findLernaPackages = require('find-lerna-packages');
const logger = require('../utils/logger');

const pkgList = findLernaPackages.sync();
// FIXME: should configure this pkg name somewhere to make it less coupled
const main = pkgList.find(pkg => pkg.name === 'app-main');
const rest = pkgList.filter(pkg => pkg !== main);

function getPkgByName(pkgName) {
  return pkgList.find(pkg => pkg.name === pkgName);
}

/**
 * format electron-builder files patterns, see https://www.electron.build/configuration/contents
 * the electron-builder file pattern is really confusing...
 * seems to be relatively in bundled app directory
 * @param {*} p
 * @param {*} pkgBase
 */
function getFormattedFilePattern(p, pkgName) {
  const negative = p.startsWith('!');
  const r = negative ? p.substr(1) : p;
  const pattern = path.join('**/node_modules/', pkgName, r);
  return negative ? `!${pattern}` : pattern;
}

/**
 * format electron builder the from of fileSet for extraResources, see https://www.electron.build/configuration/contents#extraresources
 * the 'from' is relatively from build path
 * @param {*} p
 * @param {*} pkgName
 * @returns
 */
function getFormattedExtraResourcesFileSetFromPathPattern(p, pkgName) {
  const pkg = getPkgByName(pkgName);
  const fullPath = path.resolve(pkg.location, p);
  return path.relative(main.location, fullPath);
}

function getFormattedFileSetPattern(p, pkgName) {
  if (typeof p === 'string') {
    return getFormattedExtraResourcesFileSetFromPathPattern(p, pkgName);
  }
  return {
    ...p,
    from: getFormattedExtraResourcesFileSetFromPathPattern(p.from, pkgName),
  };
}

/** get all extra defined files */
function getExtraFiles(platform) {
  const totalFiles = rest.reduce((list, pkg) => {
    const conf = pkg.get('electron-builder') || {};
    let files = [...(conf.files || []), ...((conf[platform] || {}).files || [])];
    files = files.map(p => getFormattedFilePattern(p, pkg.name));
    return [...list, ...files];
  }, []);

  return totalFiles.filter(Boolean);
}

/** get all extra defined resources */
function getExtraResources(platform) {
  const totalResources = rest.reduce((list, pkg) => {
    const conf = pkg.get('electron-builder') || {};
    let extraResources = [
      ...(conf.extraResources || []),
      ...((conf[platform] || {}).extraResources || []),
    ];
    extraResources = extraResources.map(p => getFormattedFileSetPattern(p, pkg.name));
    return [...list, ...extraResources];
  }, []);

  return totalResources.filter(Boolean);
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
  const extraResources = getExtraResources(platform);

  if (!config.files) {
    config.files = [];
  }
  if (!config.extraResources) {
    config.extraResources = [];
  }
  config.files = [...config.files, ...extraFiles];
  config.extraResources = [...config.extraResources, ...extraResources];

  //  write to local file
  const dir = path.join(process.cwd(), './node_modules/.cache/dev-utils');
  fs.mkdirpSync(dir);
  const tempFile = path.join(dir, 'electron-builder.json');
  fs.writeFileSync(tempFile, JSON.stringify(config, null, 2), 'utf8');

  logger.info('electron-builder complete config:', config);

  // https://www.electron.build/configuration/configuration
  console.log('platform', platform);
  const targets = (platform === 'mac'
    ? builder.Platform.MAC
    : builder.Platform.WINDOWS
  ).createTarget();
  builder.build({
    config,
    targets,
  });
};
