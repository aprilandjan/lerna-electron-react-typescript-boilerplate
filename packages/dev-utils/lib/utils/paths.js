const path = require('path');
const fs = require('fs');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(ext =>
    fs.existsSync(resolveFn(`${filePath}.${ext}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  /** 当前应用的路径 */
  appPath: resolveApp('.'),
  /** 当前应用的 package.json 文件 */
  appPackageJson: resolveApp('package.json'),
  /** 当前应用的静态资源目录 */
  appPublic: resolveApp('public'),
  /** 当前应用的源代码目录，webpackDevServer 会监听该目录的文件变更 */
  appSrc: resolveApp('src'),
  /** 当前页面的入口文件, js/jsx/ts/tsx 皆可 */
  appSrcEntry: resolveModule(resolveApp, 'src/index'),
  /** 当前应用的 tsconfig 配置文件 */
  appTsConfig: resolveApp('tsconfig.json'),
  /** app 构建目录 */
  appDist: resolveApp('dist'),
  /** app DLL 目录 */
  appDLL: resolveApp('dll'),
  /** app DLL manifest */
  appDLLManifest: resolveApp('dll/manifest.json'),
  /** main dev */
  appMainDev: resolveApp('dist/main.dev.js'),
  /** main prod */
  appMainProd: resolveApp('dist/main.prod.js'),
  /** renderer dev */
  appRendererDev: resolveApp('dist/renderer.dev.js'),
  /** renderer prod */
  appRendererProd: resolveApp('dist/renderer.prod.js'),
}
