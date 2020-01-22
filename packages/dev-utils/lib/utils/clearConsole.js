module.exports = function clearConsole () {
  if (process.stdout.isTTY && process.env.CLEAR_CONSOLE) {
    process.stdout.write(
      process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
    );
  }
}
