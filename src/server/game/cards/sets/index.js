import fs from 'fs';
import path from 'path';

function getDirectories(srcpath) {
  const fullPath = path.join(__dirname, srcpath);
  return fs.readdirSync(fullPath).filter((file) => fs.statSync(path.join(fullPath, file)).isDirectory());
}

function loadFiles(directory) {
  const cards = {};
  if (directory.startsWith('__')) {
    return {};
  }
  const fullPath = path.join(__dirname, directory);
  const files = fs.readdirSync(fullPath).filter(file => !fs.statSync(path.join(fullPath, file)).isDirectory());

  files.forEach(file => {
    if (!file.includes('.spec.js')) {
      const card = require(`./${directory}/${file}`); // eslint-disable-line

      cards[card.code] = card;
    }
  });
  return cards;
}

function loadCards(directory) {
  let cards = loadFiles(directory);

  getDirectories(directory).forEach(dir => {
    cards = Object.assign(cards, loadCards(path.join(directory, dir)));
  });

  return cards;
}

const directories = getDirectories('.');

export default directories.reduce(
  (cards, directory) => Object.assign(cards, loadCards(directory)),
  {}
);
