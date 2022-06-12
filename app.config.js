module.exports = ({ serial, parallel, run }) => ({
  project: {
    main: 'app-main',
    renderer: 'app-renderer',
  },
  //
  develop: {
    workflow: serial([
      run('app-main', 'dev'),
      run('app-renderer', 'dev'),
      run('app-common', 'dev'),
      run('dev-modules'),
    ]),
  },
  // build all source files
  build: {
    workflow: serial([
      parallel([run('dev-modules'), run('app-common', 'build')]),
      run('app-renderer', 'build'),
      run('app-main', 'build'),
    ]),
  },
  // electron builder config
  bundle: {
    productName: 'ElectronReact',
    appId: 'org.my.app',
    asar: false,
    files: ['./dist', 'node_modules/', 'package.json'],
    dmg: {
      contents: [
        {
          x: 130,
          y: 220,
        },
        {
          x: 410,
          y: 220,
          type: 'link',
          path: '/Applications',
        },
      ],
    },
    win: {
      target: ['nsis'],
    },
    linux: {
      target: ['deb', 'rpm', 'AppImage'],
      category: 'Development',
    },
    mac: {
      target: ['dmg'],
    },
    directories: {
      buildResources: 'resources',
      output: 'release',
    },
    publish: {
      provider: 'github',
      owner: 'play-electron',
      repo: 'play-electron',
      private: false,
    },
  },
});
