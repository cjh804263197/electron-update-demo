import rp from 'request-promise';
import path from 'path';
import fs from 'fs';
import AdmZip from 'adm-zip';
import compareVersions from 'compare-versions';
import utils from './utils';

export default class HotUpdate {
  mainWindow = null;

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  async checkUpdate() {
    try {
      const option = {
        method: 'GET',
        uri: 'https://api.github.com/repos/cjh804263197/electron-hot-update-release/releases/latest',
        headers: {
          // User-Agent is required, see https://developer.github.com/v3/#user-agent-required
          'User-Agent': 'electron-hot-update-release',
        },
        json: true,
        rejectUnauthorized: false, // resolve Error: connect ECONNREFUSED, see https://github.com/request/request-promise/issues/225#issuecomment-379802733
        insecure: true,
      };
      const res = await rp(option);
      const releaseBundleVersion = res.tag_name;
      const bundleData = fs.readFileSync(path.join(__dirname, '/bundle/bundle.json'), { encoding: 'utf-8' });
      const bundleObj = JSON.parse(bundleData);
      const localBundleVersion = bundleObj.version;
      console.log('线上版本号 => ', utils.toNum(releaseBundleVersion), '本地版本号 => ', utils.toNum(localBundleVersion));
      if (compareVersions(releaseBundleVersion, localBundleVersion) > 0 && res.assets && Array.isArray(res.assets)) {
        // 下载热更新文件
        for (const asset of res.assets) {
          console.log(`${asset.name}将要被下载`);
          await utils.download(asset.browser_download_url, path.join(__dirname, asset.name), (receivedBytes, totalBytes, percent) => {
            console.log(`${asset.name}下载中：${receivedBytes} ${totalBytes} ${percent * 100}%`);
          });
        }
        // 删除本地文件
        console.log('开始删除本地文件');
        await utils.deleteFileInDir(path.join(__dirname, '/bundle'));
        console.log('本地文件删除成功');
        // 解压缩热更新文件
        console.log('解压缩zip文件');
        const zip = new AdmZip(path.join(__dirname, '/bundle.zip'));
        zip.extractAllTo(__dirname, true);
        console.log('解压缩zip文件成功');
        this.mainWindow && this.mainWindow.loadURL(`file://${path.join(__dirname, '/bundle')}/index.html`);
      }
    } catch (err) {
      console.error('请求热更新信息出错', err);
    }
  }
}
