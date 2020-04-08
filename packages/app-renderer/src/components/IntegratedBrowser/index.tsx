import React from 'react';
import cx from 'classnames';
import {
  WebviewTag,
  WebContents,
  OnBeforeRequestListenerDetails,
  Response,
  OnBeforeSendHeadersListenerDetails,
  BeforeSendResponse,
  OnBeforeRedirectListenerDetails,
} from 'electron';
import styles from './styles.scss';

function wait(t: number = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}

interface Props {
  /** 首页地址 */
  home?: string;
}

interface States {
  /** 能否后退 */
  canBack: boolean;
  /** 能否前进 */
  canForward: boolean;
  /** 输入框的 URL */
  url: string;
  /** 实际加载的 SRC */
  src: string;
  /** 当前页面是否正在加载 */
  loading: boolean;
}

/** 集成的浏览器组件 */
export default class IntegratedBrowser extends React.Component<Props, States> {
  static defaultProps: Props = {
    home: 'http://localhost:8899',
  };
  webview?: WebviewTag;
  webContents?: WebContents;
  constructor(props: Props) {
    super(props);

    this.state = {
      canBack: false,
      canForward: false,
      src: '',
      url: this.ensureUrlWithProtocol(props.home),
      loading: false,
    };
  }
  /** 确保地址以 http/https 为协议地址 */
  ensureUrlWithProtocol(url: string = '') {
    // 不以 http/https 开头
    if (!/^(http|https):\/\//.test(url)) {
      return 'http://' + url;
    }
    return url;
  }
  /** 附加 cookie 到 header 上 */
  appendCookieToHeaders(headers: any, name: string, value: string) {
    const k = headers.hasOwnProperty('cookie') ? 'cookie' : 'Cookie';
    const v = headers[k];
    const cs = `${name}=${value}`;
    return {
      ...headers,
      [k]: v ? `${v};${cs}` : cs,
    };
  }
  componentDidMount() {
    if (!this.webview) {
      return;
    }
    // https://github.com/hokein/electron-sample-apps/blob/master/webview/browser/browser.js
    this.webview.addEventListener('close', this.handleWebviewExit);
    this.webview.addEventListener('did-start-loading', this.handleWebviewLoadStart);
    this.webview.addEventListener('did-stop-loading', this.handleWebviewLoadStop);
    this.webview.addEventListener('did-fail-load', this.handleWebviewLoadFail);
    // this.webview.addEventListener('did-get-redirect-request', this.handleWebviewLoadRedirect);
    // seems not triggering
    // this.webview.addEventListener('will-navigate', this.handleWebviewWillNavigate);
    this.webview.addEventListener('did-finish-load', this.handleWebviewLoadFinish);

    // https://github.com/ayqy/electron-webview-quick-start/blob/master/renderer.js
    this.webview.addEventListener('dom-ready', this.handleWebviewDomReady);
  }
  handleWebviewExit = () => {
    //
  };
  handleWebviewLoadStart = (event: any) => {
    // console.log('load start....', event, this.webview!.getURL());
    this.setState({
      loading: true,
    });
  };
  handleWebviewLoadStop = () => {
    // console.log('load stop');
    this.setState({
      loading: false,
    });
  };
  handleWebviewLoadFail = () => {
    // console.log('load fail');
  };
  // handleWebviewWillNavigate = (event: any) => {
  //   console.log('navigate', event, this.webview!.getURL());
  //   this.setState({
  //     url: this.webview!.getURL(),
  //   });
  // }
  handleWebviewLoadFinish = () => {
    // console.log('load finish', this.webview!.getURL());
    this.setState({
      canBack: this.webview!.canGoBack(),
      canForward: this.webview!.canGoForward(),
      url: this.webview!.getURL(),
    });
  };
  handleWebviewDomReady = () => {
    // more details:
    // https://www.electronjs.org/docs/api/session
    // https://www.electronjs.org/docs/api/web-request
    // console.log('webview dom ready', this.webview?.getWebContentsId());
    if (!this.webContents) {
      // no need to do it on every page nav
      // set userAgent
      this.webContents = this.webview!.getWebContents();
      const userAgent = this.webContents.getUserAgent();
      this.webContents.setUserAgent(`${userAgent} my-electron-app`);
      const { session } = this.webContents;
      session.webRequest.onBeforeRequest(
        {
          urls: ['*://*/*'],
        },
        this.handleBeforeRequest
      );
      session.webRequest.onBeforeSendHeaders(
        {
          urls: ['*://*/*'],
        },
        this.handleBeforeSendHeaders
      );
      // session.webRequest.onBeforeRedirect({
      //   urls: ['*://*/*'],
      // }, this.handleBeforeRedirect);
    }
    // console.log('web content id:', this.webContents!.id);
  };
  handleBeforeRequest = async (
    details: OnBeforeRequestListenerDetails,
    callback: (response: Response) => void
  ) => {
    //  can be used to cancel or manually redirect to some other locations
    const url = new URL(details.url);
    const resp = {
      cancel: false,
    };
    if (url.hostname === 'localhost' && /\/test/.test(url.pathname)) {
      await wait(1000);
      resp.cancel = true;
    }
    callback(resp);
  };
  handleBeforeSendHeaders = async (
    details: OnBeforeSendHeadersListenerDetails,
    callback: (beforeSendResponse: BeforeSendResponse) => void
  ) => {
    //  can be used to do some async task and inject custom header
    const url = new URL(details.url);
    const extraHeader: any = {};
    // FIXME: only interpolate page request
    // if (url.hostname === 'localhost' && url.port === '8899') {
    await wait(1000);
    Object.assign(extraHeader, {
      //  header must be string
      'x-extra-header': String(Date.now()),
    });
    // }
    //  inject cookie
    const requestHeaders = this.appendCookieToHeaders(
      {
        ...details.requestHeaders,
        'x-app-name': 'my-electron-app',
        ...extraHeader,
      },
      'name',
      'value'
    );

    callback({
      requestHeaders,
    });
  };
  // handleBeforeRedirect = async (details: OnBeforeRedirectListenerDetails) => {
  //   const { redirectURL, url } = details;
  //   console.log('from', url, 'to', redirectURL);
  // }
  handleBack = () => {
    this.webview?.goBack();
  };
  handleForward = () => {
    this.webview?.goForward();
  };
  handleHome = () => {
    const { home } = this.props;
    const urlWithProtocol = this.ensureUrlWithProtocol(home);
    this.setState({
      url: urlWithProtocol,
      src: urlWithProtocol,
    });
  };
  handleReload = () => {
    const { loading } = this.state;
    if (loading) {
      this.webview?.stop();
    } else {
      this.webview?.reload();
    }
  };
  handleChangeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      url: e.target.value,
    });
  };
  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const code = e.keyCode || e.charCode;
    const { url } = this.state;
    if (code === 13) {
      this.setState({
        src: this.ensureUrlWithProtocol(url),
      });
    }
  };
  handleGo = () => {
    this.setState({
      src: this.ensureUrlWithProtocol(this.state.url),
    });
  };
  renderControls() {
    const { canBack, canForward, url } = this.state;

    return (
      <div className={styles.controls}>
        <button
          className={styles.btn}
          id="back"
          title="Go Back"
          disabled={!canBack}
          onClick={this.handleBack}
        >
          &#9664;
        </button>
        <button
          className={styles.btn}
          id="forward"
          title="Go Forward"
          disabled={!canForward}
          onClick={this.handleForward}
        >
          &#9654;
        </button>
        <button className={styles.btn} id="home" title="Go Home" onClick={this.handleHome}>
          &#8962;
        </button>
        <button className={styles.btn} id="reload" title="Reload" onClick={this.handleReload}>
          &#10227;
        </button>
        <input
          className={cx(styles.btn, styles.urlInput)}
          id="location"
          type="text"
          value={url}
          onChange={this.handleChangeURL}
          onKeyPress={this.handleKeyPress}
        />
        <button className={styles.btn} value="Go" onClick={this.handleGo}>
          Go
        </button>
      </div>
    );
  }

  renderErrors() {
    return (
      <div>
        <div id="sad-webview">
          <div id="sad-webview-icon">&#9762;</div>
          <h2 id="crashed-label">Aw, Snap!</h2>
          <h2 id="killed-label">He's Dead, Jim!</h2>

          <p>
            Something went wrong while displaying this webpage. To continue, reload or go to another
            page.
          </p>
        </div>
      </div>
    );
  }

  render() {
    const { src } = this.state;
    return (
      <div className={styles.box}>
        {this.renderControls()}
        <div className={styles.browser}>
          <webview ref={ref => (this.webview = ref as any)} className={styles.webview} src={src} />
        </div>
      </div>
    );
  }
}
