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

function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

  fs.readdir(stylesFolder, (err, styles) => {
    if (err) {
      return console.log(err.message);
    } else {
      styles.forEach(style => {
        if (path.extname(style) === '.css') {
          fs.readFile(path.join(__dirname, 'styles', style), {encoding: 'utf-8'}, (err, data) => {
            if (err) {
              return console.log(err.message);
            }
            writeFileAsync(bundlePath, data);
          });
        }
      });
    }
  });
}

mergeStyles();
