import uuid from 'uuid';
import { durations, spheres } from '../constants';
import AbilityDsl from './ability-dsl';
import { CardAction, CardResponse, CardInterrupt } from './abilities';

const validKeywords = [
  'ambush',
  'archery',
  'battle',
  'guarded',
  'indestructible',
  'peril',
  'permanent',
  'ranged',
  'restricted',
  'sentinel',
  'siege',
  'surge',
  'venom',
];

const validValueKeywords = [
  'doomed',
  'hide',
  'prowl',
  'regenerate',
  'sack',
  'secrecy',
  'underworld',
  'villagers',
];

export default class BaseCard {
  constructor(owner, cardData) {
    this.owner = owner;
    this.controller = owner;
    this.game = owner.game;
    this.cardData = cardData;

    this.uuid = uuid.v1();
    this.code = `${cardData.setid}-${cardData.num}`;
    this.name = cardData.name;
    this.text = cardData.text;
    this.cost = cardData.cost;
    this.spheres = [spheres[cardData.sphere.toLowerCase()]];

    this.tokens = {};

    this.abilities = {
      actions: [],
      responses: [],
      persistentEffects: [],
      playActions: [],
    };

    this.parseKeywords(cardData.keywords || '');
    this.parseTraits(cardData.traits || '');
    this.setupCardAbilities(AbilityDsl);
  }

  parseTraits(traits) {
    const firstLine = traits.split('\n')[0];
    this.traits = firstLine.split('.').reduce((acc, trait) => ({
      ...acc,
      [trait]: acc[trait] ? acc[trait] + 1 : 1,
    }), {});
  }

  parseKeywords(keywords = '') {
    const firstLine = keywords.split('\n')[0];
    const potentialKeywords = firstLine.split('.').map(k => k.toLowerCase().trim());

    this.keywords = potentialKeywords.reduce((acc, keyword) => {
      if (validKeywords.indexOf(keyword) > -1) {
        acc.simple[keyword] = true;
      } else {
        validValueKeywords.forEach(valueKeyword => {
          const match = keyword.match(new RegExp(`${valueKeyword} (\\d)?`));
          if (match) {
            acc.valued[valueKeyword] = parseInt(match[1], 10);
          }
        });
      }

      return acc;
    }, {
      simple: {},
      valued: {}
    });
  }

  setupCardAbilities(abilityDsl) {} // eslint-disable-line no-unused-vars, class-methods-use-this

  action(properties) {
    const action = new CardAction(this.game, this, properties);

    if (action.isClickToActivate() && action.allowMenu()) {
      const index = this.abilities.actions.length;
      this.menu.push(action.getMenuItem(index));
    }
    this.abilities.actions.push(action);
  }

  response(properties) {
    const response = new CardResponse(this.game, this, properties);

    if (response.triggered()) {
      // TODO: prompt user if they want to use response
    }

    this.abilities.responses.push(response);
  }

  interrupt(properties) {
    const interrupt = new CardInterrupt(this.game, this, properties);

    this.abilities.interrupts.push(interrupt);
  }

  persistentEffect(properties) {
    const { persistent } = durations;
    this.abilities.persistentEffects.push(Object.assign({ duration: persistent }, properties));
  }

  isCharacter() {
    return false;
  }
}
