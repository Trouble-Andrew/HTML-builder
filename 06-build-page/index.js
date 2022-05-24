const fs = require('fs');
const path = require('path');

const removeFolderAsync = async (folderPath) => {
  return new Promise((resolve, reject) => fs.rm(folderPath, {recursive: true, force: true}, (err) => {
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

const readFileAsync = async (path) => {
  return new Promise((resolve, reject) => fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
    if (err) {
      return reject(err.message);
    }
    resolve(data);
  }));
};

const getComponentsListAsync = async (folder) => {
  return new Promise((resolve, reject) => fs.readdir(folder, {withFileTypes: true}, (err, files) => {
    if (err) {
      return reject(err.message);
    }
    resolve(files);
  }));
};

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const bundlePath = path.join(__dirname, 'project-dist', 'style.css');

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

const copyFolderAsync = async (folderPath, folderDest) => {
  return new Promise((resolve, reject) => fs.readdir(folderPath, (err, items) => {
    if (err) {
      return reject(err.message);
    } else {
      items.forEach(item => {
        fs.stat(path.join(folderPath, item), (err, stats) => {
          if (err) {
            throw err;
          }

          if (stats.isFile()) {
            fs.copyFile(path.join(folderPath, item), path.join(folderDest, item), (err) => {
              if (err) {
                throw err;
              }
            });
          }

          if (stats.isDirectory()) {
            fs.mkdir(path.join(folderDest, item), {recursive: true}, (err) => {
              if (err) {
                throw err;
              }
            });
            copyFolderAsync(path.join(folderPath, item), path.join(folderDest, item));
          }
        });
      });
    }
    resolve();
  }));
};

function buildPage() {
  const PROJECT_DIST = path.join(__dirname, 'project-dist');
  const COMPONENTS_FOLDER = path.join(__dirname, 'components');
  const HTML_TEMPLATE = path.join(__dirname, 'template.html');
  const ASSETS_FOLDER = path.join(__dirname, 'assets');
  const ASSETS_DEST = path.join(PROJECT_DIST, 'assets');
  let COMPONENTS = [];

  removeFolderAsync(PROJECT_DIST)
    .then(() => createFolderAsync(PROJECT_DIST))
    .then(() => createFolderAsync(path.join(PROJECT_DIST, 'assets')))
    .then(() => fs.copyFile(HTML_TEMPLATE, path.join(PROJECT_DIST, 'template.html'), (err) => {
      if (err) {
        throw err;
      }
    }))
    .then(() => {
      copyFolderAsync(ASSETS_FOLDER, ASSETS_DEST);
    })
    .then(() => getComponentsListAsync(COMPONENTS_FOLDER))
    .then((components) => {
      console.log(components);
      for (const component of components) {
        COMPONENTS.push(component);
      }
    })
    .then(() => readFileAsync(path.join(PROJECT_DIST, 'template.html')))
    .then((data) => {
      return data;
    })
    .then((data) => {
      for (const component of COMPONENTS) {
        const stream = fs.createReadStream(path.join(COMPONENTS_FOLDER, component.name), 'utf-8');

        let componentData = '';

        stream.on('data', chunk => componentData += chunk);
        stream.on('end', () => {
          data = data.replace(`{{${component.name.replace(/(\.\w+$)/igm, '')}}}`, componentData);
          writeFileAsync(path.join(PROJECT_DIST, 'template.html'), data);
        });

      }
    })
    .then(() => mergeStyles());
}

buildPage();
