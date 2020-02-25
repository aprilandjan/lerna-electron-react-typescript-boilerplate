// const path = require('path');
const http = require('http');
const logger = require('./logger');
const env = require('./env');

async function isRendererReady() {
  return new Promise(resolve => {
    http
      .get(`http://${env.host}:${env.port}/dev-server-status`, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          if (data === 'ready') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      })
      .on('error', () => {
        resolve(false);
      });
  });
}

async function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

/** 轮询确认 dev server 是否已准备好，默认最多轮询 3 分钟 */
module.exports = async function pollingRenderer(interval = 500, retry = 120 * 3) {
  let i = 0;
  let ready = false;
  while (!ready && i < retry) {
    if (i % 20 === 0) {
      logger.info('wait util renderer dev server ready...');
    }
    if (i !== 0) {
      await delay(interval);
    }
    i++;
    logger.debug(`check if renderer dev server is ready... #${i}/${retry}`);
    // eslint-disable-next-line
    ready = await isRendererReady();
  }
  return ready;
};
