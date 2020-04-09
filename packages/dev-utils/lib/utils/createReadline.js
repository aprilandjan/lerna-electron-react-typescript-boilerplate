const readline = require('readline');

module.exports = function createReadline(config) {
  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt(config.text || 'Press >');
  let callback = config.callback;
  let matcher = String(config.matcher)
    .trim()
    .toLowerCase();
  rl.on('line', line => {
    if (line.toLowerCase().trim() === matcher) {
      if (callback) {
        callback();
      }
    }
  });
  return rl;
};
