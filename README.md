# Lerna-Electron-React-TypeScript Boilerplate

A complete [Lerna](https://github.com/lerna/lerna)-[Electron](https://github.com/electron/electron)-[React](https://github.com/facebook/react)-[TypeScript](https://github.com/microsoft/TypeScript) project boilerplate.

## Why

When developing electron applications, perhaps you want to separate main process codes and renderer process codes into isolated parallel packages, and perhaps even more structure-independent packages which are actually linked while using. For example:

```bash
root
├── app-main          # main process source codes
├── app-renderer      # renderer process source codes
└── app-common-utils  # some commonly used codes
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

## TODO

- [x] use `lerna`
- [x] add electron icons
- [x] ensure `dev` & `build` progress
- [x] add renderer compile time progress
- [ ] automatically dll compare & rebuild
- [x] check dll running speed
- [x] app main watch & reload: reload: use webpack, listen its compile status
- [x] main process ask for restart if needed
- [ ] main process modules partly hot-reload
- [ ] main & renderer communicate through node ipc
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
- [ ] all scripts in `typescript`
- [ ] support unittest & e2e test
- [ ] app auto-update
- [x] attach debugger for main process in vscode
- [ ] attach chrome debugger for main process in vscode
- [ ] separated eslint rules for node scripts and browser scripts
- [ ] add eslint in webpack compile check
- [x] allow skip typechecking in webpack compiler
- [ ] webpack resolve and build lerna modules
- [x] electron builder(asar) packing
- [x] support `require.context` with webpack alias path
- [ ] lerna command registered with dotenv files
- [ ] find out unused files in main/renderer bundle
- [ ] find out repeat files between main & renderer bundle

## References

- <https://github.com/electron-react-boilerplate/electron-react-boilerplate>
- <https://github.com/electron-react-boilerplate/examples/tree/master/examples/typescript>
- <https://github.com/amaurymartiny/cra-lerna-electron>
- <https://webpack.js.org/configuration/devtool/>
- <https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps>
