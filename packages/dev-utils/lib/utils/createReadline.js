const readline = require('readline');
const chalk = require('chalk');

// { 'R': { desc, callback, disabled }, 'C': { desc, callback, disabled } }
module.exports = function createReadline(mapping) {
  const rl = readline.createInterface(process.stdin, process.stdout);
  const text = Object.entries(mapping)
    .filter(pair => {
      const [key, { disabled }] = pair;
      return !disabled;
    })
    .map(pair => {
      const [key, { desc }] = pair;
      return chalk.bold(chalk.gray(`${chalk.green(key)} ${desc}`));
    })
    .join(', ');

  rl.setPrompt(`\nPress > ${text}\n\n`);

  rl.on('line', line => {
    const input = line.toLowerCase().trim();
    Object.entries(mapping).forEach(pair => {
      const [key, { callback, disabled }] = pair;
      const match = String(key)
        .trim()
        .toLowerCase();
      if (match === input && callback && !disabled) {
        callback();
      }
    });
  });
  return rl;
};
