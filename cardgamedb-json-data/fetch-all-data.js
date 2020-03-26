import path from 'path';
import fs from 'fs';
import 'isomorphic-fetch';
import log from './logger';

const urls = {
  quest: 'http://ronderksen.nl/wordpress/wp-content/uploads/2017/12/QuestCards.json',
  encounter: 'http://ronderksen.nl/wordpress/wp-content/uploads/2017/12/EncounterCards.json',
  player: 'http://ronderksen.nl/wordpress/wp-content/uploads/2017/12/PlayerCards.json',
};

function parsePlayerCards(cardData) {
  log.info(`Parsing ${cardData.length} player cards...`);
  return cardData.reduce((acc, card) => {
    const pack = card.CardSet;
    if (!acc[pack]) {
      acc[pack] = [];
    }
    acc[pack].push({
      name: card.Title,
      isUnique: card.isUnique,
      type: card.CardType,
      sphere: card.Sphere,
      willPower: card.Front.Stats.Willpower,
      threatCost: card.Front.Stats.ThreatCost,
      attack: card.Front.Stats.Attack,
      defense: card.Front.Stats.Defense,
      hitPoints: card.Front.Stats.HitPoints,
      traits: card.Front.Traits,
      keywords: card.Front.Keywords,
      text: card.Front.Text,
      setId: card.Number,
    });
    return acc;
  }, {})
}

function parseEncounterCards(cardData) {
  log.info(`Parsing ${cardData.length} encounter cards...`);
  return cardData.reduce((acc, card) => {
    const pack = card.CardSet;
    if (!acc[pack]) {
      acc[pack] = [];
    }

    acc[pack].push({
      name: card.Title,
      type: card.CardType,
    });

    return acc;
  }, {})
}

function parseQuestCards(cardData) {
  log.info(`Parsing ${cardData.length} quest cards...`);
  return cardData.reduce((acc, card) => {
    log.info(`Parsing ${card.Title}`);
    const pack = card.CardSet;
    if (!acc[pack]) {
      acc[pack] = [];
    }

    acc[pack].push({
      name: card.Title,
      type: card.CardType,
      encounterName: card.EncounterInfo && card.EncounterInfo.EncounterSet,
      setId: card.Number,
      front: card.Front && {
        text: card.Front.Text,
        flavorText: card.Front.FlavorText,
      },
      back: card.Back && {
        text: card.Back.Text,
        flavorText: card.Back.FlavorText,
      }
    });

    return acc;
  }, {})
}

function parseCardData(cardData, deckType) {
  switch (deckType) {
    case 'player':
      return parsePlayerCards(cardData);
    case 'encounter':
      return parseEncounterCards(cardData);
    case 'quest':
      return parseQuestCards(cardData);
    default:
      return [];
  }
}

function ensurePathExists(pathName, ...args) {
  let [mask, cb] = args;
  if (!cb) {
    cb = mask;
    mask = 0o777;
  }
  fs.mkdir(pathName, mask, (err) => {
    if (err) {
      if (err.code === 'EEXIST') cb(null); // ignore the error if the folder already exists
      else cb(err); // something else went wrong
    } else cb(null); // successfully created folder
  });
}

function createPackDirectory(packName) {
  return new Promise((resolve, reject) => {
    const packRootDir = path.resolve(__dirname, 'pack');
    const packDir = `${packRootDir}/${packName.replace(/\s/g , '')}`;
    ensurePathExists(packDir, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve(packDir);
    });
  });
}

function createFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    })
  });
}


function writeToFiles(cardData, deckType) {
  try {
    Object.entries(cardData).forEach(async ([pack, cards]) => {
      const packDir = await createPackDirectory(pack);
      await createFile(`${packDir}/${deckType}.json`, cards);
    });
  } catch (err) {
    log.error(err);
  }
}

function createScenarios(questData) {
  // questData is an object that contains quest cards per pack, so
  // we use values to just get arrays of cards
  const scenarios = Object.values(questData)
    // then flatten the nested array to a single array
    .reduce((acc, pack) => {
      acc.push(...pack);
      return acc;
    }, [])
    // then reduce the array
    .reduce((acc, questCard) => {
      // console.log(questCard);
      if (!questCard.encounterName) {
        return acc;
      }
      const encounterName = questCard.encounterName.replace(/\s/g, '');
      if (!acc[encounterName]) {
        acc[encounterName] = {
          encounterName: questCard.encounterName,
          quests: [],
        }
      }
      acc[encounterName].quests.push(questCard.setId);
      return acc;
    }, {});

  createFile(path.resolve(__dirname, 'scenarios.json'), Object.values(scenarios));
}

log.info('Starting to import card data');
Object.entries(urls).forEach(async ([key, url]) => {
  log.info(`Importing ${key} cards`);
  try {
    const cardData = await fetch(url)
      .then(response => response.json())
      .then(data => { log.info('Data fetched. Start parsing...'); return data; })
      .then(data => parseCardData(data, key));
    if (key === 'quest') {
      createScenarios(cardData);
    }
    writeToFiles(cardData, key);
    log.info(`Written ${key} cards to file.`)
  } catch (err) {
    log.error(err);
  }
});
