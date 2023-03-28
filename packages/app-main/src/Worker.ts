import { fork, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

interface Config {
  id: string;
  socketName: string;
}

export default class Worker extends EventEmitter {
  private _config: Config;
  private _cp: ChildProcess | null = null;
  private _ready: boolean = false;

  constructor(config: Config) {
    super();

    this._config = config;

    this._init();
  }

  private _init() {
    const isDev = process.env.NODE_ENV === 'development';
    // webpack will intercept 'require.resolve' to module id, which is not the real file path
    // see https://github.com/webpack/webpack/issues/9367
    // use '__non_webpack_require__' to bypass that
    // see https://webpack.js.org/api/module-variables/#__non_webpack_require__-webpack-specific
    const entry = __non_webpack_require__.resolve('app-worker');
    console.log('worker entry:', entry);
    const args = [isDev ? '--inspect' : ''].filter(Boolean);
    console.log('worker args:', args);
    this._cp = fork(entry, args, {
      stdio: isDev ? 'inherit' : 'ignore',
    });
    // https://nodejs.org/api/child_process.html#class-childprocess
    this._cp.on('message', this._handleCpMessage);
    this._cp.on('error', this._handleCpError);
    this._cp.on('close', this._handleCpClose);
  }

  private _handleCpMessage = (msg: string) => {
    console.log('receive msg', msg);
    if (msg === 'ready') {
      this._ready = true;
      this.emit('ready');
    } else {
      // TODO: handle other messages
    }
  };

  private _handleCpError = (err: Error) => {
    this._cp?.removeAllListeners();
    this._cp = null;
    this._ready = false;

    this.emit('error', err);
  };

  private _handleCpClose = (code: number, signal: string) => {
    // TODO:
    console.log('cp close with', code, signal);
    this._cp?.removeAllListeners();
    this._cp = null;
    this._ready = false;

    this.emit('close', code, signal);
  };

  public send(msg: any) {
    if (!this._ready || !this._cp) {
      throw new Error('not ready');
    }
    this._cp?.send(msg);
  }

  public whenReady(): Promise<undefined> {
    if (this._ready) {
      return Promise.resolve(undefined);
    }
    return new Promise(resolve => {
      this.once('ready', () => {
        resolve(undefined);
      });
    });
  }
}
