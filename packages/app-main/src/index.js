import { app, BrowserWindow, ipcMain } from 'electron';
import { format } from 'url';
import path from 'path';
import MenuBuilder from '@/menu';
import show1 from 'module-a';
import show3 from 'module-c';
import { log } from 'app-common';
import Worker from './Worker';

log('We have all local workspace modules ready', show1, show3, log);

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;

if (isDev) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const options = { loadExtensionOptions: { allowFileAccess: true }, forceDownload };
  // eslint-disable-next-line no-console
  return installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS], options).catch(console.log);
};

const createWindow = async () => {
  if (isDev) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    format({
      pathname: path.join(__dirname, isDev ? '../index.html' : './index.html'),
      protocol: 'file',
      slashes: true,
    })
  );

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('crashed', evt => {
    console.log('crashed', evt);
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  ipcMain.on('quit', () => {
    process.exit(1);
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

setInterval(() => {
  global['m'] = Math.random();
}, 1000);

const t = Date.now();
const worker = new Worker({
  id: 'hello world',
  socketName: 'name',
});
worker.whenReady().then(() => {
  console.log(`tWorkerReady = ${Date.now() - t}`);
});
