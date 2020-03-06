import request from 'request';
import fs from 'fs';
import path from 'path';
import {
  existsAsync,
  statAsync,
  readdirAsync,
  deleteDir,
  deleteFile,
} from './fsAsync';

function download(dowloadUrl, targetPath, onprogress) {
  return new Promise((resolve, reject) => {
    let receivedBytes = 0;
    let totalBytes = 0;

    const req = request({
      method: 'GET',
      uri: dowloadUrl,
    });

    const out = fs.createWriteStream(targetPath, { flags: 'w+' });
    req.pipe(out);

    req.on('response', res => {
      // Change the total bytes value to get progress later.
      totalBytes = parseInt(res.headers['content-length'].toString(), 0);
    });

    req.on('data', chunk => {
      receivedBytes += chunk.length;
      onprogress && onprogress(receivedBytes, totalBytes, receivedBytes / totalBytes);
    });

    req.on('complete', res => {
      resolve(res);
    });

    req.on('error', err => {
      reject(err);
    });

  });
}

function toNum(a) {
  const aStr = a.toString();
  const arry = aStr.split('.');
  const numPlace = ['', '0', '00', '000', '0000'];
  const r = numPlace.reverse();
  for (let i = 0; i < arry.length; i++) {
    const len = arry[i].length;
    arry[i] = r[len] + arry[i];
  }
  return arry.join('');
}

async function deleteFileInDir(localpath) {
  const exist = await existsAsync(localpath);
  if (exist) {
    const stat = await statAsync(localpath);
    if (stat.isDirectory()) {
      const files = await readdirAsync(localpath);
      for (const file of files) {
        const curPath = path.join(localpath, file);

        await this.deleteFileInDir(curPath);
      }
      await deleteDir(localpath);
    } else {
      await deleteFile(localpath);
    }
  } else {
    console.error('loacl path is not exists');
    throw new Error('loacl path is not exists');
  }
}

export default {
  download,
  toNum,
  deleteFileInDir,
};

