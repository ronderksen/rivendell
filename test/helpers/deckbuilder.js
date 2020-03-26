import fs from 'fs';
import path from 'path';
import { matchCardByNameAndPack } from './cardutil';

const pathToSubmodulePacks = '../../cardgamedb-json-data/pack';

export default class DeckBuilder {
  constructor() {
    this.cards = this.loadCards(pathToSubmodulePacks);
  }

  loadCards(directory) {
    return fs.readdirSync(path.resolve(__dirname, directory))
      .filter(file => file.endsWith('.json'))
      // eslint-disable-next-line import/no-dynamic-require, global-require
      .map((file) => require(path.join(directory, file)))
      .reduce((acc, card) => ({
        ...acc,
        [card.code]: card,
      }));
  }

  getCard(codeOrLabelOrName) {
    if(this.cards[codeOrLabelOrName]) {
      return this.cards[codeOrLabelOrName];
    }

    const cardsByName = this.cards.filter(matchCardByNameAndPack(codeOrLabelOrName));

    if(cardsByName.length === 0) {
      throw new Error(`Unable to find any card matching ${codeOrLabelOrName}`);
    }

    if(cardsByName.length > 1) {
      const matchingLabels = cardsByName.map(card => `${card.name} (${card.setid})`).join('\n');
      throw new Error(`Multiple cards match the name ${codeOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
    }

    return cardsByName[0];
  }

  buildEncounterDeck(cardLabels) {
    return cardLabels.reduce((deck, label) => {
      const cardData = this.getCard(label);
      if (deck[cardData.code]) {
        return {
          ...deck,
          [cardData.code]: {
            ...deck[cardData.code],
            count: deck[cardData.code].count + 1
          }
        };
      }
      return {
        ...deck,
        [cardData.code]: {
          count: 1,
          card: cardData,
        }
      };
    }, {});
  }

  buildDeck(heroLabels, cardLabels) {
    const heroes = heroLabels.reduce((heroCards, label) => {
      const cardData = this.getCard(label);
      const cardCode = `${cardData.setid}-${cardData.num}`;
      cardData.code = cardCode;

      return {
        ...heroCards,
        [cardCode]: cardData,
      };
    }, {});
    const drawCards = cardLabels.reduce((deck, label) => {
      const cardData = this.getCard(label);
      const cardCode = `${cardData.setid}-${cardData.num}`;
      cardData.code = cardCode;

      if (deck[cardCode]) {
        return {
          ...deck,
          [cardCode]: {
            ...deck[cardCode],
            count: deck[cardCode].count + 1
          }
        };
      }
      return {
        ...deck,
        [cardCode]: {
          count: 1,
          card: cardData,
        }
      };
    }, {});

    return {
      heroes,
      drawCards
    };
  }
}
