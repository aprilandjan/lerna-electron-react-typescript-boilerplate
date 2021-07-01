const execa = require('execa');
const chalk = require('chalk');
const stripAnsi = require('strip-ansi');
const codeFrame = require('@babel/code-frame').codeFrameColumns;
const os = require('os');
const fs = require('fs');
const path = require('path');
const findLernaPackages = require('find-lerna-packages');
const env = require('./env');
const logger = require('./logger');

const pkgList = findLernaPackages.sync();

const compilation = {
  startAt: 0,
};

function getFileScope(file) {
  // skip this if is already in a module scope
  if (process.cwd().endsWith(env.target)) {
    return '';
  }
  const pkg = pkgList.find(pkg => {
    return file.startsWith(pkg.location);
  });
  if (pkg) {
    return pkg.name;
  }
  return '';
}

function formatTypescriptErrorInfo(info) {
  const { scope, file, line, column, level, code, content } = info;
  const colors = new chalk.Instance();
  const messageColor = level === 'warn' ? colors.yellow : colors.red;
  const fileAndNumberColor = colors.bold.cyan;
  const source = file && fs.existsSync(file) && fs.readFileSync(file, 'utf-8');
  let frame = '';
  if (source) {
    frame = codeFrame(
      source,
      {
        start: {
          line,
          column,
        },
      },
      {
        highlightCode: true,
      }
    )
      .split('\n')
      .map(str => `  ${str}`)
      .join(os.EOL);
  }
  const scopeMessage = `${scope ? chalk.cyan(`[${scope}] `) : ''}`;
  const output = [
    `${messageColor.bold(`TypeScript ${level} in `)}${scopeMessage}${fileAndNumberColor(
      `${file}(${line},${column})`
    )}${messageColor(':')}`,
    `${content}  ${messageColor.underline(code)}`,
    '',
    frame,
  ].join(os.EOL);
  return `${colors.inverse(file)}\n${output}`;
}

function extractTypescriptErrorInfo(message) {
  const result = /(?<file>.+)\((?<line>\d+),(?<column>\d+)\): (?<level>error|warn) (?<code>TS\d+): (?<content>.+)/gm.exec(
    message
  );
  if (result && result.groups) {
    // turn file path to absolute path
    const absolutePath = path.join(process.cwd(), result.groups.file);
    //  parse scope
    return {
      ...result.groups,
      file: absolutePath,
      scope: getFileScope(absolutePath),
    };
  }
}

function processOutput(data) {
  const lines = stripAnsi(data.toString()).trim();
  if (lines === '') {
    return;
  }
  if (
    lines.endsWith(`Starting compilation in watch mode...`) ||
    lines.endsWith(`Starting incremental compilation...`)
  ) {
    compilation.startAt = Date.now();
  } else if (lines.endsWith(`Watching for file changes.`)) {
    logger.info(`Compiled in ${Date.now() - compilation.startAt} ms`);
  } else {
    lines.split('\n').forEach(line => {
      const info = extractTypescriptErrorInfo(line);
      if (info) {
        logger.info(formatTypescriptErrorInfo(info));
      } else {
        logger.info(line);
      }
    });
  }
}

module.exports = (args = []) => {
  const p = execa('tsc', [...args], {
    localDir: env.lernaRootPath,
    preferLocal: true,
    stdin: 'inherit',
  });

  p.stdout.on('data', processOutput);
  p.stderr.on('data', processOutput);

  p.on('exit', code => {
    p.removeAllListeners();
    if (code !== 0) {
      logger.info(`tsc ${args} exit unexpectedly(${code})!`);
    }
  });

  return p;
};
