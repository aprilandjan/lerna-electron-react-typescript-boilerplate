module.exports = (api, opts) => {
  let {
    //  use ts language
    useTypesScript = true,
    //  use react related plugins
    useReact = true,
  } = opts || {};

  //  if defined via env, then use react configs
  if (process.env.BABEL_CONFIG_REACT === 'true') {
    useReact = true;
  } else if (process.env.BABEL_CONFIG_REACT === 'false') {
    useReact = false;
  }

  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';

  // see docs about api at https://babeljs.io/docs/en/config-files#apicache
  api.cache(true);

  return {
    env: {
      development: {
        compact: false,
      },
    },
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: require('electron/package.json').version },
        },
      ],
      useReact && [
        require('@babel/preset-react'),
        {
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
      useTypesScript && [require('@babel/preset-typescript')],
    ].filter(Boolean),
    plugins: [
      //  support export v from 'xxx'
      require('@babel/plugin-proposal-export-default-from'),
      // Turn on legacy decorators for TypeScript files
      useTypesScript && [
        require('@babel/plugin-proposal-decorators'),
        {
          legacy: true,
        },
      ],
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      // Note:
      // 'loose' mode configuration must be the same for
      // * @babel/plugin-proposal-class-properties
      // * @babel/plugin-proposal-private-methods
      // * @babel/plugin-proposal-private-property-in-object
      [
        require('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      [
        require('@babel/plugin-proposal-private-methods'),
        {
          loose: true,
        },
      ],
      [
        require('@babel/plugin-proposal-private-property-in-object'),
        {
          loose: true,
        },
      ],
      //  let budget = 1_000_000_000_000;
      require('@babel/plugin-proposal-numeric-separator'),
      require('@babel/plugin-syntax-dynamic-import'),
      //  a?.b
      [require('@babel/plugin-proposal-optional-chaining'), { loose: false }],
      //  var foo = object.foo ?? "default"
      [require('@babel/plugin-proposal-nullish-coalescing-operator'), { loose: false }],
      //  load antd as needed
      useReact && [
        require('babel-plugin-import'),
        {
          libraryName: 'antd',
          libraryDirectory: 'lib',
          style: 'css',
        },
      ],
      // Transform dynamic import to require
      isEnvTest && require('babel-plugin-dynamic-import-node'),
      isEnvTest && require('babel-plugin-require-context-hook'),
      ...(isEnvProduction && useReact
        ? [
            require('@babel/plugin-transform-react-constant-elements'),
            require('@babel/plugin-transform-react-inline-elements'),
            require('babel-plugin-transform-react-remove-prop-types'),
          ]
        : []),
      isEnvDevelopment && useReact && [require('react-hot-loader/babel')],
    ].filter(Boolean),
    overrides: [
      useTypesScript && {
        test: /\.tsx?$/,
        plugins: [[require('@babel/plugin-proposal-decorators'), { legacy: true }]],
      },
    ].filter(Boolean),
  };
};
