const logger = require('./logger');

module.exports = (err) => {
  const message = err !== null && err.message;
  logger.info((message || err) + '\n');
  logger.info();
}
