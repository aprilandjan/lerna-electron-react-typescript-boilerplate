const ipc = require('node-ipc');
const env = require('./env');
const logger = require('./logger');

// https://github.com/RIAEvangelist/node-ipc/tree/master/example/unixWindowsSocket/Multi-Client-Broadcast
ipc.config.logger = () => {};
ipc.config.retry = 1500;

const serverId = 'server';
const clients = [];
let initialized = false;
let isClient = false;

function initServer(onReady) {
  if (initialized) {
    return;
  }
  logger.debug('ipc server try init...');
  ipc.config.id = serverId;
  ipc.serve(() => {
    logger.debug('ipc server initialized');
    initialized = true;
    isClient = false;
    ipc.server.on('message', (payload, socket) => {
      logger.debug(`ipc server receive client(${payload.id}):`, payload.data);
      if (payload.data === 'ready') {
        clients.push(payload.id);
        if (onReady) {
          onReady(clients);
        }
      }
    });
  });
  ipc.server.start();
}

function initClient(onReady) {
  if (initialized) {
    return;
  }
  ipc.config.id = env.target;
  ipc.connectTo(serverId, () => {
    initialized = true;
    isClient = true;
    logger.debug(`ipc client(${ipc.config.id}) connect to server`);
    ipc.of[serverId].on('message', data => {
      logger.debug(`ipc client(${ipc.config.id}) receive server:`, data);
    });
    if (onReady) {
      onReady();
    }
  });
}

function sendToServer(data) {
  if (!initialized || !isClient) {
    return;
  }
  logger.debug(`ipc client(${ipc.config.id}) try to send to server`, data);
  ipc.of[serverId].emit('message', {
    id: ipc.config.id,
    data,
  });
}

function broadcast(data) {
  if (!initialized || isClient) {
    return;
  }
  ipc.server.broadcast('message', data);
}

module.exports = {
  initServer,
  initClient,
  sendToServer,
  broadcast,
};
