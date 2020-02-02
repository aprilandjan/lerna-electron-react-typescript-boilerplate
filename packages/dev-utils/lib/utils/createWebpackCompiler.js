const chalk = require('chalk');
const webpack = require('webpack');
const logger = require('./logger');
const formatWebpackMessages = require('./formatWebpackMessages');
const typescriptFormatter = require('./typescriptFormatter');
const clearConsole = require('./clearConsole');

module.exports = function createCompiler(options) {
  const {
    // webpack config
    config,
    devSocket,
    useTypeScript,
    tscCompileOnError,
    //  compile callback
    onCompiled,
    onFirstCompiledSuccess,
  } = options;
  let compiler;
  let isFirstCompiledSuccess = true;
  const handleCompiled = (success, s) => {
    if (onCompiled) {
      onCompiled(success, s);
    }
  };
  const handleFirstCompiledSuccess = s => {
    if (!isFirstCompiledSuccess) {
      return;
    }
    isFirstCompiledSuccess = false;
    if (onFirstCompiledSuccess) {
      onFirstCompiledSuccess(s);
    }
  };
  try {
    compiler = webpack(config);
  } catch (err) {
    logger.info(chalk.red('Failed to compile.'));
    logger.info();
    logger.info(err.message || err);
    logger.info();
    handleCompiled(false);
    process.exit(1);
  }

  // "invalid" event fires when you have changed a file, and Webpack is
  // recompiling a bundle. WebpackDevServer takes care to pause serving the
  // bundle, so if you refresh, it'll wait instead of serving the old one.
  // "invalid" is short for "bundle invalidated", it doesn't imply any errors.
  compiler.hooks.invalid.tap('invalid', () => {
    clearConsole();
    logger.info('Compiling...');
  });

  let tsMessagesPromise;
  let tsMessagesResolver;

  if (useTypeScript) {
    compiler.hooks.beforeCompile.tap('beforeCompile', () => {
      tsMessagesPromise = new Promise(resolve => {
        tsMessagesResolver = msgs => resolve(msgs);
      });
    });

    // FIXME: require ts plugin
    // eslint-disable-next-line
    const forkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

    forkTsCheckerWebpackPlugin
      .getCompilerHooks(compiler)
      .receive.tap('afterTypeScriptCheck', (diagnostics, lints) => {
        const allMsgs = [...diagnostics, ...lints];
        const format = message => `${message.file}\n${typescriptFormatter(message, true)}`;

        tsMessagesResolver({
          errors: allMsgs.filter(msg => msg.severity === 'error').map(format),
          warnings: allMsgs.filter(msg => msg.severity === 'warning').map(format),
        });
      });
  }

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

    if (useTypeScript && statsData.errors.length === 0) {
      const delayedMsg = setTimeout(() => {
        logger.info(chalk.yellow('Files successfully emitted, waiting for typecheck results...'));
      }, 100);

      const messages = await tsMessagesPromise;
      clearTimeout(delayedMsg);
      if (tscCompileOnError) {
        statsData.warnings.push(...messages.errors);
      } else {
        statsData.errors.push(...messages.errors);
      }
      statsData.warnings.push(...messages.warnings);

      // Push errors and warnings into compilation result
      // to show them after page refresh triggered by user.
      if (tscCompileOnError) {
        stats.compilation.warnings.push(...messages.errors);
      } else {
        stats.compilation.errors.push(...messages.errors);
      }
      stats.compilation.warnings.push(...messages.warnings);

      if (devSocket) {
        if (messages.errors.length > 0) {
          if (tscCompileOnError) {
            devSocket.warnings(messages.errors);
          } else {
            devSocket.errors(messages.errors);
          }
        } else if (messages.warnings.length > 0) {
          devSocket.warnings(messages.warnings);
        }
      }

      clearConsole();
    }

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    if (isSuccessful) {
      logger.info(chalk.green(`Compiled successfully in ${t} ms!`));
      handleCompiled(true, stats);
      handleFirstCompiledSuccess(stats);
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
      handleFirstCompiledSuccess(stats);
    }
  });
  return compiler;
};
