// IMPORTANT: electron(v8) requires that the spectron(v10) is used
// the version of webdriverio bounds in spectron(v10) is `4.x`
// so the client api documentation is: http://v4.webdriver.io/api.html
import path from 'path';
import { Application } from 'spectron';

const electronPath: string = require('electron').toString();
const entryPath: string = path.join(__dirname, '../../packages/app-main/dist/main.prod.js');

let app: Application;

describe('application launch', () => {
  beforeAll(async () => {
    app = new Application({
      path: electronPath,
      args: [entryPath],
    });
    await app.start();
    await app.client.waitUntilWindowLoaded();
  }, 15000);

  afterAll(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('should display window', async () => {
    const winCount = await app.client.getWindowCount();
    await app.client.windowByIndex(0);
    expect(winCount).toBe(1);
  });

  it('should display correct page content', async () => {
    const header = await app.client.getText(`[data-testid="home"]`);
    expect(header).toEqual('Home');
  });
});
