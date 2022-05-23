const fs = require('fs');
const path = require('path');

const writeFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => fs.writeFile(path, data, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

const appendFileAsync = async (path, data) => {
  return new Promise((resolve, reject) => fs.appendFile(path, data, (err) => {
    if (err) {
      return reject(err.message);
    }
    resolve();
  }));
};

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  fs.readdir(stylesFolder, (err, styles) => {
    if (err) {
      return console.log(err.message);
    } else {
      writeFileAsync(bundlePath, '');
      styles.forEach(style => {
        if (path.extname(style) === '.css') {
          fs.readFile(path.join(__dirname, 'styles', style), {encoding: 'utf-8'}, (err, data) => {
            if (err) {
              return console.log(err.message);
            }
            appendFileAsync(bundlePath, data + '\n');
          });
        }
      });
    }
  });
}

mergeStyles();
