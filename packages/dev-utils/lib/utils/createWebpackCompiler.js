const chalk = require('chalk');
const webpack = require('webpack');
const merge = require('webpack-merge');
const logger = require('./logger');
const formatWebpackMessages = require('./formatWebpackMessages');
const clearConsole = require('./clearConsole');
const getUserWebpackConfig = require('./getUserWebpackConfig');

const userConfig = getUserWebpackConfig();

/** 生成 webpack compiler。会自动合并用户当前的 webpack 配置 */
module.exports = function createCompiler(options) {
  const {
    // webpack config
    config,
    //  compile callback
    onCompiled,
    onFirstCompiledSuccess,
    // others
    useTypescript,
  } = options;
  let compiler;
  let successCount = 0;
  const handleCompiled = (success, stat) => {
    if (success) {
      successCount++;
    }
    const isFirstCompiledSuccess = successCount === 1 && success;
    if (onCompiled) {
      onCompiled(success, stat, isFirstCompiledSuccess);
    }
    if (isFirstCompiledSuccess && onFirstCompiledSuccess) {
      onFirstCompiledSuccess(stat);
    }
  };
  try {
    compiler = webpack(merge.smart(config, userConfig));
  } catch (err) {
    logger.info(chalk.red('Failed to compile.'));
    logger.info();
    logger.info(err.message || err);
    logger.info();
    handleCompiled(false);
    process.exit(1);
  }

  let tsCheckDefer = {
    promise: null,
    resolve: null,
    reject: null,
  };
  if (useTypescript) {
    tsCheckDefer.promise = new Promise((resolve, reject) => {
      tsCheckDefer.resolve = resolve;
      tsCheckDefer.reject = reject;
    });

    const hooks = require('fork-ts-checker-webpack-plugin').getCompilerHooks(compiler);
    hooks.start.tap('ts-checker', () => {
      tsCheckDefer.promise = new Promise((resolve, reject) => {
        tsCheckDefer.resolve = resolve;
        tsCheckDefer.reject = reject;
      });
    });
    hooks.issues.tap('ts-checker', issues => {
      tsCheckDefer.resolve(issues);
    });
  } else {
    tsCheckDefer.promise = Promise.resolve([]);
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.hooks.invalid.tap('invalid', () => {
    clearConsole();
    logger.info('Compiling...');
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap('done', async stats => {
    clearConsole();

    const t = stats.endTime - stats.startTime;
    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    // We only construct the warnings and errors for speed:
    // https://github.com/facebook/create-react-app/issues/4492#issuecomment-421959548
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const tsIssues = await tsCheckDefer.promise;

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length && !tsIssues.length;
    if (isSuccessful) {
      logger.info(chalk.green(`Compiled successfully in ${t} ms!`));
      handleCompiled(true, stats);
      return;
    }

    //
    if (tsIssues.length) {
      logger.info(chalk.red(`Typescript check failed. Found ${tsIssues.length} issue(s).`));
      logger.info(messages.errors.join('\n\n'));
      handleCompiled(false);
      return;
    }

    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      logger.info(chalk.red('Failed to compile.\n'));
      logger.info(messages.errors.join('\n\n'));
      handleCompiled(false);
      return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      logger.info(chalk.yellow(`Compiled with warnings in ${t} ms.\n`));
      logger.info(messages.warnings.join('\n\n'));

      // Teach some ESLint tricks.
      logger.info(
        '\nSearch for the ' +
          chalk.underline(chalk.yellow('keywords')) +
          ' to learn more about each warning.'
      );
      logger.info(
        'To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n'
      );
      handleCompiled(true, stats);
    }
  });
  return compiler;
};
