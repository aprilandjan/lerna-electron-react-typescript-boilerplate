// https://github.com/MatthieuLemoine/unused-webpack-plugin
// make it able to delete these files
const path = require('path');
const fs = require('fs-extra');
const deglob = require('deglob');
const chalk = require('chalk');

function searchFiles(directory, ignoreGlobPatterns = [], useGitIgnore = true) {
  const config = { ignore: ignoreGlobPatterns, cwd: directory, useGitIgnore };
  return new Promise((resolve, reject) => {
    deglob('**/*', config, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

class UnusedFilesWebpackPlugin {
  constructor(options = {}) {
    this.sourceDirectories = options.directories || [];
    this.exclude = options.exclude || [];
    this.root = options.root;
    this.autoDelete = options.autoDelete;
    this.useGitIgnore = options.useGitIgnore || true;
  }

  apply(compiler) {
    const checkUnused = (compilation, callback) => {
      // Files used by Webpack during compilation
      const usedModules = Array.from(compilation.fileDependencies)
        .filter(file => this.sourceDirectories.some(dir => file.indexOf(dir) !== -1))
        .reduce((obj, item) => Object.assign(obj, { [item]: true }), {});
      // Go through sourceDirectories to find all source files
      Promise.all(
        this.sourceDirectories.map(directory =>
          searchFiles(directory, this.exclude, this.useGitIgnore)
        )
      )
        // Find unused source files
        .then(files => files.map(array => array.filter(file => !usedModules[file])))
        .then(display.bind(this))
        // .then(continueOrFail.bind(this, this.failOnUnused, compilation))
        .then(callback);
    };
    compiler.hooks.emit.tapAsync('UnusedPlugin', checkUnused);
  }
}

function display(filesByDirectory) {
  const allFiles = filesByDirectory.reduce((array, item) => array.concat(item), []);
  if (!allFiles.length) {
    return Promise.resolve([]);
  }
  process.stdout.write('\n');
  process.stdout.write(chalk.green('\n*** Unused Plugin ***\n'));
  process.stdout.write(chalk.red(`${allFiles.length} unused source files found.\n`));
  filesByDirectory.forEach((files, index) => {
    if (files.length === 0) return;
    const directory = this.sourceDirectories[index];
    const relative = this.root ? path.relative(this.root, directory) : directory;
    process.stdout.write(chalk.blue(`\n● ${relative}\n`));
    files.forEach(file =>
      process.stdout.write(chalk.yellow(`    • ${path.relative(directory, file)}\n`))
    );
  });
  process.stdout.write(chalk.green('\n*** Unused Plugin ***\n\n'));
  if (this.autoDelete) {
    filesByDirectory.forEach(files => {
      files.forEach(f => fs.unlinkSync(f));
    });
  }
  return Promise.resolve(allFiles);
}

module.exports = UnusedFilesWebpackPlugin;
