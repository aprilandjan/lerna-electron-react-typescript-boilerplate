/* eslint global-require: off */

module.exports = (api, opts, env) => {
  const {
    //  use ts language
    useTypesScript = true,
    //  use react related plugins
    useReact = true,
  } = opts;
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: require('electron/package.json').version }
        }
      ],
      useReact && [
        require('@babel/preset-react'),
        {
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
        }
      ],
      useTypesScript && [
        require('@babel/preset-typescript'),
      ],
    ].filter(Boolean),
    plugins: [
      // Turn on legacy decorators for TypeScript files
      useTypesScript && [
        require('@babel/plugin-proposal-decorators'),
        false,
      ],
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require('@babel/plugin-proposal-class-properties'),
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
      [
        require('@babel/plugin-proposal-nullish-coalescing-operator'),
        { loose: false }
      ],
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      isEnvDevelopment && [
        require('react-hot-loader/babel')
      ],
      isEnvTest &&
        // Transform dynamic import to require
        require('babel-plugin-dynamic-import-node'),
      ...(isEnvProduction && useReact && [
        require('@babel/plugin-transform-react-constant-elements'),
        require('@babel/plugin-transform-react-inline-elements'),
        require('babel-plugin-transform-react-remove-prop-types')
      ])
    ].filter(Boolean),
    overrides: [
      useTypesScript && {
        test: /\.tsx?$/,
        plugins: [
          [
            require('@babel/plugin-proposal-decorators').default,
            { legacy: true },
          ],
        ],
      },
    ].filter(Boolean),
  };
};
