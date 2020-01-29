/* eslint global-require: off */

const developmentEnvironments = ['development', 'test'];

const developmentPlugins = [
  require('react-hot-loader/babel')
];

const productionPlugins = [

  // babel-preset-react-optimize
  require('@babel/plugin-transform-react-constant-elements'),
  require('@babel/plugin-transform-react-inline-elements'),
  require('babel-plugin-transform-react-remove-prop-types')
];

module.exports = api => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache

  const development = api.env(developmentEnvironments);

  return {
    presets: [
      [
        require('@babel/preset-env'),
        {
          targets: { electron: require('electron/package.json').version }
        }
      ],
      [require('@babel/preset-react'), { development }]
    ],
    plugins: [
      // Stage 0
      //  obj::func(val) => func.call(obj, val)
      require('@babel/plugin-proposal-function-bind'),

      // Stage 1
      // FIXME: remove with ts, export v from 'mod-v'
      require('@babel/plugin-proposal-export-default-from'),
      // FIXME: remove with ts, a ||= b;
      require('@babel/plugin-proposal-logical-assignment-operators'),
      //  a?.b
      [require('@babel/plugin-proposal-optional-chaining'), { loose: false }],
      // FIXME: remove with ts, "hello" |> capitalize |> exclaim
      [
        require('@babel/plugin-proposal-pipeline-operator'),
        { proposal: 'minimal' }
      ],
      //  var foo = object.foo ?? "default"
      [
        require('@babel/plugin-proposal-nullish-coalescing-operator'),
        { loose: false }
      ],
      //  FIXME: remove with ts
      require('@babel/plugin-proposal-do-expressions'),

      // Stage 2
      [require('@babel/plugin-proposal-decorators'), { legacy: true }],
      //  FIXME: remove with ts
      require('@babel/plugin-proposal-function-sent'),
      //  FIXME: remove with ts, export * as ns from 'mod'
      require('@babel/plugin-proposal-export-namespace-from'),
      //  let budget = 1_000_000_000_000;
      require('@babel/plugin-proposal-numeric-separator'),
      //  FIXME: remove with ts
      require('@babel/plugin-proposal-throw-expressions'),

      // Stage 3
      require('@babel/plugin-syntax-dynamic-import'),
      // FIXME: ...not needed
      require('@babel/plugin-syntax-import-meta'),
      [require('@babel/plugin-proposal-class-properties'), { loose: true }],
      //  FIXME: not important, remove it
      require('@babel/plugin-proposal-json-strings'),

      ...(development ? developmentPlugins : productionPlugins)
    ]
  };
};
