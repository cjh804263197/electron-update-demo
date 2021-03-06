import { app, BrowserWindow, dialog } from 'electron' // eslint-disable-line
import { autoUpdater } from 'electron-updater';
// import { testAdmZip } from './testAdmZip';
// import { testGithubRelease } from './githubRelease';
// import HotUpdate from './HotUpdate';
const fs = require('fs');
const path = require('path');
const appVersion = require('../../package.json').version;

console.log('appVersion => ', appVersion);

if (process.env.NODE_ENV !== 'development') {
  const bundleData = fs.readFileSync(path.join(__dirname, '/bundle/bundle.json'), { encoding: 'utf-8' });
  const bundleObj = JSON.parse(bundleData);
  console.log('bundleVersion => ', bundleObj.version);
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${path.join(__dirname, '/bundle')}/index.html`;

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates();

  // testAdmZip();
  // testGithubRelease();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.on('update-not-available', () => {
  console.log('暂未发现新版本 => ');
  const options = {
    alwaysOnTop: true,
    type: 'question',
    title: 'MeshkitDesktop 更新提示',
    message: '最新版本已经下载完成，请立即更新。',
    detail: '请立即更新，新版本增加了一些功能，修复了一些错误。\n 1.更新了xxx\n 2.修复了xxx',
    buttons: ['立即更新', '下次启动更新'],
  };
  dialog.showMessageBox(mainWindow, options, () => {});
  // new HotUpdate(mainWindow).checkUpdate();
});

autoUpdater.on('update-available', (info) => {
  console.log('发现了新版本 => ', info);
});

autoUpdater.on('download-progress', progressObj => {
  console.log('正在下载 => ', progressObj);
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
