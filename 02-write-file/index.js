const fs = require('fs');
const path = require('path');

const {stdin, stdout} = process;
const filePath = path.join(__dirname, 'text.txt');

function init() {
  fs.readFile(filePath, (error) => {
    if (error) {
      fs.writeFile(filePath, '', (error) => {
        if (error) return console.error(error.message);
      });
    }
  });
}

function exit() {
  stdout.write('Удачи в изучении Node.js!');
  process.exit();
}

stdout.write('Введите текст: \n');

init();

stdin.on('data', data => {
  const dataStringified = data.toString();

  if (dataStringified.trim() === 'exit') {
    exit();
  }

  fs.readFile(filePath, (error, data) => {
    if (error) return console.error(error.message);
    let text = data.toString();
    text += dataStringified;

    fs.writeFile(filePath, text, (error) => {
      if (error) return console.error(error.message);
    });
  });
});

process.on('SIGINT', () => {
  exit();
});

