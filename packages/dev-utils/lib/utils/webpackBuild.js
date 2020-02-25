const fs = require('fs-extra');
// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const chalk = require('chalk');
const paths = require('./paths');
const env = require('./env');
const logger = require('./logger');
const getUserWebpackConfig = require('./getUserWebpackConfig');
const formatWebpackMessages = require('./formatWebpackMessages');
const printError = require('./printError');
const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require('./reportFileSize');

const userConfig = getUserWebpackConfig();

/** 启用 webpack build */
module.exports = function(webpackConfig) {
  function build(previousFileSizes) {
    return new Promise((resolve, reject) => {
      logger.info('start building production build...');

      const compiler = webpack(merge.smart(webpackConfig, userConfig));
      compiler.run((err, stats) => {
        let messages;
        if (err) {
          if (!err.message) {
            return reject(err);
          }

          let errMessage = err.message;

          // Add additional information for postcss errors
          if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
            errMessage += '\nCompileError: Begins at CSS selector ' + err.postcssNode.selector;
          }

          messages = formatWebpackMessages({
            errors: [errMessage],
            warnings: [],
          });
        } else {
          messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true })
          );
        }
        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1;
          }
          return reject(new Error(messages.errors.join('\n\n')));
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
          messages.warnings.length
        ) {
          logger.info(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          );
          return reject(new Error(messages.warnings.join('\n\n')));
        }

        return resolve({
          stats,
          previousFileSizes,
          warnings: messages.warnings,
        });
      });
    });
  }

  return measureFileSizesBeforeBuild(paths.appDist)
    .then(previousFileSizes => {
      fs.emptyDirSync(paths.appDist);

      if (fs.existsSync(paths.appPublic)) {
        // copy public
        fs.copySync(paths.appPublic, paths.appDist, {
          dereference: true,
          // filter: file => file !== paths.appHtml,
        });
      }
      return build(previousFileSizes);
    })
    .then(({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        logger.info(chalk.yellow('Compiled with warnings.\n'));
        logger.info(warnings.join('\n\n'));
        logger.info(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        logger.info(
          'To ignore, add ' + chalk.cyan('// eslint-disable-next-line') + ' to the line before.\n'
        );
      } else {
        logger.info(
          chalk.green(`Compiled successfully in ${stats.endTime - stats.startTime} ms.\n`)
        );
      }

      logger.info('File sizes:\n');
      printFileSizesAfterBuild(stats, previousFileSizes, paths.appDist);
      return null;
    })
    .catch(err => {
      if (env.compileOnTsError) {
        logger.info(
          chalk.yellow(
            'Compiled with the following type errors (you may want to check these before deploying your app):\n'
          )
        );
        printError(err);
      } else {
        logger.info(chalk.red('Failed to compile.\n'));
        printError(err);
        process.exit(1);
      }
    });
};
