# Lerna-Electron-React-TypeScript Boilerplate

A complete [Lerna](https://github.com/lerna/lerna)-[Electron](https://github.com/electron/electron)-[React](https://github.com/facebook/react)-[TypeScript](https://github.com/microsoft/TypeScript) project boilerplate.

## Why

When developing electron applications, perhaps you want to separate main process codes and renderer process codes into isolated parallel packages, and perhaps even more structure-independent packages which are actually linked while using. For example:

```bash
root
├── app-main          # main process source codes
├── app-renderer      # renderer process source codes
└── app-common        # some commonly used codes
```

That's why in this boilerplate we use [Lerna](https://github.com/lerna/lerna) to help managing such a `monorepo` structure.

## Features

This boilerplate is constructed originally from [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate), but changed greatly to support `lerna` `typescript` things. The `webpack` related develop experience mainly comes from [CRA](https://github.com/facebook/create-react-app) and [electron-webpack](https://github.com/electron-userland/electron-webpack). It supports:

- monorepo maintained by [lerna](https://github.com/lerna/lerna) and [yarn workspace mode](https://yarnpkg.com/lang/en/docs/workspaces/)
- [typescript](https://github.com/microsoft/TypeScript)(v3.7+) and babel7 support
- [eslint](https://github.com/eslint/eslint)(with ts support), [stylelint](https://github.com/stylelint/stylelint)(with scss support), [prettier](https://github.com/prettier/prettier) and [commitlint](https://github.com/conventional-changelog/commitlint) integrated
- smooth and friendly development experience from [CRA](https://github.com/facebook/create-react-app) and [electron-webpack](https://github.com/electron-userland/electron-webpack).

## Usage

Just clone this repo and install using `yarn`:

```bash
$ git clone git@github.com:aprilandjan/lerna-electron-react-typescript-boilerplate.git
$ yarn
```

## Develop

```bash
yarn dev
```

Check more scripts in `package.json` scripts field.

### Debug Main Process

`vscode` debugger supports only `inline-source-map`. In order to debug main process in vscode debugger, we should:

- change webpack devtool into `inline-source-map`
- use `sourceMapPathOverrides` in `launch.json` to correctly map webpack resources into actual resource url
- alternatively, use webpack [devtoolModuleFilenameTemplate](https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate) to change generated sourcemap data url.

## Build

```bash
yarn build
```

Check more scripts in `package.json` scripts field.

## Release

```bash
yarn package
```

Check more scripts in `package.json` scripts field.

## Version & Changelog

```bash
lerna publish --bump 1.1.0
```

If you want to skip changes for specific files or modules, add [--ignore-changes](https://github.com/lerna/lerna/blob/master/commands/version/README.md#--ignore-changes) to specify them.

## TODO

- [x] use `lerna`
- [x] add electron icons
- [x] ensure `dev` & `build` progress
- [x] add renderer compile time progress
- [ ] automatically dll compare & rebuild
- [x] check dll running speed
- [x] app main watch & reload: reload: use webpack, listen its compile status
- [x] main process ask for restart if needed
- [ ] ~~main process modules partly hot-reload~~
- [x] main & renderer communicate through node ipc
- [x] extract webpack things into dev-utils
- [x] customizable build step
- [x] whole project building process
- [x] fix main bundle build warning
- [x] pack electron app
- [x] add `typescript`
- [x] allow `typescript` path alias
- [x] allow mixed `js(x)` and `ts(x)`
- [x] encapsuled eslint config
- [x] encapsuled babel config
- [x] style class name generation
- [x] tsconfig include only src(or exclude `node_modules`) to speed up typechecking
- [x] user customized webpack config merging
- [x] renderer webpack externals be default set as the main package's dependencies
- [x] support unittest
- [x] support e2e test
- [x] attach debugger for main process in vscode
- [x] attach debugger for main process while startup: add cmd to disable auto launch electron while dev, and extra vscode launch config
- [x] attach debugger for renderer process in vscode
- [ ] ~~separated eslint rules for node scripts and browser scripts~~
- [ ] ~~add eslint in webpack compile check~~
- [x] allow skip typechecking in webpack compiler
- [x] webpack resolve and build lerna modules
- [x] electron builder(asar) packing
- [x] support `require.context` with webpack alias path
- [x] ~~lerna command registered with dotenv files~~ make `dev-utils` env read from lerna root path prior
- [x] find out unused files in main/renderer bundle
- [x] logger info output time diff in ms like `debugger`
- [x] allow filter electron output message
- [x] bug: set env always later than read dotenv files
- [ ] allow app-module build without webpack (using tsc and babel only)
- [ ] allow workspace code compile altogether
- [ ] configurable electron-builder options for mac/win separately
- [x] bug: windows cannot quit dev process smoothly
- [x] support `func?.()` in js files
- [x] use `find-lerna-package` to locate sub packages
- [x] ipc server automatically satisfied ipc client count
- [ ] parallel build sub packages
- [x] complete type-safe components with `redux` `react-thunk`, etc
- [x] when bundling node codes, automatically external all node_modules packages
- [x] support ~~type-safe~~ node require in webpack bundled files [references](https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific)
- [x] use `execa` instead of native `child_process`
- [ ] inject bundle build information, such as `commitId`, `branchName`, `buildTime`, `buildMachine`, `buildPipelineId` into process env
- [x] automatically generate changelog files(~~for different major/minor versions~~)
- [ ] when failed to launching electron, find if existed process is running and print warning (and force kill it in some seconds)
- [ ] ~~handle with "failed to fetch extension, trying x more times"~~
- [x] skip use of `yarn` to run `dev` & `build`
- [x] add timestamp before each output line
- [x] outputs from std error are marked as red
- [x] allow disable console time prefix & suffix
- [x] ~~bug: sometimes press ctrl+c cannot terminate process, for example, when press fn+c~~ allow press `X` to exit dev process
- [x] the resources of each sub-modules when bundled support
- [ ] use rollup to compile & bundle esm modules
- [ ] create bundle at the root directory of the workspace
- [x] bug: spawned child process did not exit when terminated in windows
- [ ] add unittest for dev scripts
- [x] make execa not spawn process with extra shell processes
- [x] customize testing-library `data-testid`([ref](https://github.com/testing-library/react-testing-library/issues/204))
- [ ] make clear electron app running environments while e2e tests
- [x] when electron process exit as expected, do not quit dev process automatically
- [ ] renderer webpack automatically exclude main dependencies
- [ ] support multiple dev instance running in same computer
- [x] allow press `C` to clear console if TTY
- [x] bug: json serialized outstream does not displayed completely in main process
- [ ] use [ultra-runner](https://github.com/folke/ultra-runner) to call npm scripts
- [x] bugfix: set `PORT` env does not correctly apply to the `Electron: Main` launch script
- [x] bugfix: listener leaks when restart electron dev process
- [ ] use esbuild to speed up dev & build
- [x] allow press `Q` to quit running electron app
- [ ] specify different shortcut for vscode launch tasks
- [ ] allow watch & reload env files and restart dev process

## References

- <https://github.com/electron-react-boilerplate/electron-react-boilerplate>
- <https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript>
- <https://github.com/amaurymartiny/cra-lerna-electron>
- <https://webpack.js.org/configuration/devtool/>
- <https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps>
- <https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific>
- <https://github.com/seymen/git-last-commit>
- <https://github.com/electron-userland/spectron>
- <http://v4.webdriver.io/api.html>
