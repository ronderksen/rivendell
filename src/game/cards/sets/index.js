import fs from 'fs';
import path from 'path';

function getDirectories(srcpath) {
  const fullPath = path.join(__dirname, srcpath);
  return fs.readdirSync(fullPath).filter((file) => fs.statSync(path.join(fullPath, file)).isDirectory());
}

function loadFiles(directory) {
  const fullPath = path.join(__dirname, directory);
  const files = fs.readdirSync(fullPath).filter(file => !fs.statSync(path.join(fullPath, file)).isDirectory());

  for(const file of files) {
    const card = require(`./${  directory  }/${  file}`);

    cards[card.code] = card;
  }
}

function loadCards(directory) {
  let cards = {};

  loadFiles(directory);

  getDirectories(directory).forEach(dir => {
    cards = Object.assign(cards, loadCards(path.join(directory, dir)));
  });

  return cards;
}

let cards = {};
const directories = getDirectories('.');

for(const directory of directories) {
  cards = Object.assign(cards, loadCards(directory));
}

module.exports = cards;
