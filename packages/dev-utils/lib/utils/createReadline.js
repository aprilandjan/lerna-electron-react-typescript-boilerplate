const readline = require('readline');

module.exports = function createReadline() {
  const rl = readline.createInterface(process.stdin, process.stdout);
  rl.setPrompt('input >');
  let callback;
  let matcher = '';
  rl.on('line', line => {
    if (line.toLowerCase().trim() === matcher) {
      if (callback) {
        callback();
      }
      callback = null;
    }
  });
  return {
    rl,
    prompt: config => {
      callback = config.callback;
      matcher = String(config.matcher)
        .trim()
        .toLowerCase();
      rl.setPrompt(config.text || 'input >');
      rl.prompt();
    },
    close: () => {
      rl.close();
    },
  };
};
