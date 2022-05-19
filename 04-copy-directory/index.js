const fs = require('fs');
const path = require('path');

const removeFolderAsync = async (folderPath) => {
  return new Promise((resolve, reject) => fs.rm(folderPath, {recursive: true}, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

const createFolderAsync = async (folderPath) => {
  return new Promise((resolve, reject) => fs.mkdir(folderPath, {recursive: true}, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

const readFolderAsync = async (folderPath) => {
  return new Promise((resolve, reject) => fs.readdir(folderPath, (err, files) => {
    if (err) {
      return reject(err.message);
    } else {
      files.forEach(file => {
        fs.stat(path.join(__dirname, 'files', file), (err, stats) => {
          if (err) {
            console.log(err);
          }

          if (stats.isFile()) {
            fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
              if (err) {
                console.log(err);
              }
            });
          }
        });
      });
    }
    resolve();
  }));
};

function copyDir() {
  fs.stat(path.join(__dirname, 'files-copy'), function (err) {
    if (!err) {
      removeFolderAsync(path.join(__dirname, 'files-copy'))
        .then(() => createFolderAsync(path.join(__dirname, 'files-copy')))
        .then(() => readFolderAsync(path.join(__dirname, 'files')));
    }
    else if (err.code === 'ENOENT') {
      createFolderAsync(path.join(__dirname, 'files-copy'))
        .then(() => readFolderAsync(path.join(__dirname, 'files')));
    }
  });
}

copyDir();

