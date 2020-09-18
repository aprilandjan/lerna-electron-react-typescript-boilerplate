/** { cmd, script } */
module.exports = function run(map) {
  const args = process.argv.slice(2);
  const cmdList = Object.keys(map);
  const cmdIndex = args.findIndex(x => cmdList.includes(x));
  const cmd = cmdIndex === -1 ? args[0] : args[cmdIndex];
  // const nodeArgs = cmdIndex > 0 ? args.slice(0, cmdIndex) : [];

  if (cmdList.includes(cmd)) {
    require(map[cmd]);
  } else {
    throw new Error('Unknown command "' + cmd + '".');
  }
};
