import * as fs from 'fs';

function readdirAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function statAsync(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function deleteDir(path) {
  return new Promise((resolve, reject) => {
    fs.rmdir(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function mkdirAsync(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function existsAsync(path) {
  return new Promise((resolve) => {
    fs.exists(path, exists => {
      resolve(exists);
    });
  });
}

export
{
  readdirAsync,
  statAsync,
  readFileAsync,
  deleteFile,
  mkdirAsync,
  existsAsync,
  deleteDir,
};
