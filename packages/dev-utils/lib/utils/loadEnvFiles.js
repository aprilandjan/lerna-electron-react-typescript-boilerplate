const fs = require('fs-extra');
const path = require('path');
const paths = require('./paths');
const NODE_ENV = process.env.NODE_ENV;

const cwd = process.cwd();

let loadedEnv = null;

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvPatterns = [
  `.env.${NODE_ENV}.local`,
  `.env.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `.env.local`,
  `.env`,
].filter(Boolean);

/** load environments from .env files */
function loadEnvFiles() {
  if (loadedEnv) {
    clearLoadedEnv();
  }
  // load from self directory prior, then from the root path
  const dotenvFiles = [cwd, paths.workspaceRoot].reduce((files, dir) => {
    dotenvPatterns.forEach(p => {
      const fullPath = path.join(dir, p);
      if (!files.includes(fullPath) && fs.existsSync(fullPath)) {
        files.push(fullPath);
      }
    });
    return files;
  }, []);

  const envBeforeLoad = {
    ...process.env,
  };

  //  load these env files
  dotenvFiles.forEach(dotenvFile => {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  });

  loadedEnv = {};
  Object.keys(process.env).forEach(key => {
    if (!envBeforeLoad.hasOwnProperty(key)) {
      loadedEnv[key] = process.env[key];
    }
  });

  return loadedEnv;
}

/** clear loaded environments from env files */
function clearLoadedEnv() {
  if (!loadedEnv) {
    return;
  }
  Object.keys(loadedEnv).forEach(key => {
    delete process.env[key];
  });
  loadedEnv = {};
}

module.exports = {
  loadEnvFiles,
  clearLoadedEnv,
};
