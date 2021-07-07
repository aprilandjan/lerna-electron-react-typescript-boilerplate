# dev-utils

Development utilities for managing main process webpack bundle, renderer process webpack bundle, modules that need webpack to bundle, and modules that need typescript to compile.

## Binary

This module provides the following binary and commands for developing various modules associated with the electron app.

### `app-main`

CLI for electron main process bundle codes.

- `app-main dev`: start webpack dev & watch
- `app-main build`: build webpack production bundle
- `app-main start`: run electron from the entry of the production bundle. This is useful if you want to test run the production bundle quickly.

### `app-renderer`

CLI for electron renderer process bundle codes.

- `app-renderer dev`: start webpack dev & watch & webpack-dev-server
- `app-renderer build`: build webpack production bundle

### `app-pack`

CLI for modules that need webpack to bundle its codes.

- `app-pack dev`: start webpack dev & watch
- `app-pack build`: build webpack production bundle

### `app-module`

CLI for modules that need typescript to bundle its codes.

- `app-module dev`: start tsc dev & watch
- `app-module build`: build tsc production codes
- `app-module clean`: clean tsc output files

### `app-bundle`

CLI wrapping up `electron-builder`. It will try to read `electron-builder` field from the `package.json` file of each local monorepo packages, and then merge the `files` field altogether, for **self-management** purpose.

- `app-bundle --mac`: build for package
- `app-bundle --win`: build win package

Alternatively, additional `electron builder` arguments can be passed over.

## Environments

### `HOST`

渲染进程 dev server 的 host。默认为 `localhost`

### `PORT`

渲染进程 dev server 的 port。默认为 `1212`

### `CLEAR_CONSOLE`

是否在 dev 时按 webpack 的信息需要自动刷掉输出。默认 `false`

### `OPEN_ANALYZER`

在运行时启动 `WebpackBundleAnalyzer` 输出打包分析报告。默认为 `false`

### `REBUILD_DLL`

在运行 `app-renderer dev` 时强制重新构建 webpack DLL。默认为 `false`

### `DISABLE_TS_CHECK`

关掉 webpack 编译时的 `typescript` 类型检查。默认为 `false`

### `COMPILE_ON_TS_ERROR`

TS 报错时依然编译。默认为 `false`

### `ELECTRON_AUTO_START`

开发环境下 Electron 进程是否在 webpack 编译后自动启动。默认为 `true`

### `ELECTRON_AUTO_RELOAD`

开发环境下 Electron 进程是否在 webpack 编译后自动重启。也可以通过输入 `R` + `Enter` 随时手动重启。默认 `false`
