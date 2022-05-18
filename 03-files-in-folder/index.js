const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath,
  {withFileTypes: true},
  (err, files) => {
    console.log(' Current directory files:');
    if (err)
      console.log(err);
    else {
      files.forEach(file => {
        let size = 0;

        fs.stat(path.join(dirPath, file.name), (error, stats) => {
          if (error) {
            console.log(error);
          }
          else {
            size = stats.size;

            if (stats.isFile()) {
              console.log(`${file.name.replace(/(\.\w+$)/igm, '')} - ${path.extname(file.name).replace('.', '')} - ${size * 0.001}kb`);
            }
          }
        });
      });
    }
  });
