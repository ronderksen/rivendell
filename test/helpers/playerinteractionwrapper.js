import {matchCardByNameAndPack} from "./cardutil";


export default class PlayerInteractionWrapper {
  constructor(game, player) {
    this.game = game;
    this.player = player;

    this.player.noTimer = true;
    this.player.user = {
      settings: {}
    };
  }

  get name() {
    return this.player.name;
  }

  get firstPlayer() {
    return this.player.firstPlayer;
  }

  get activePlot() {
    return this.player.activePlot;
  }

  currentPrompt() {
    return this.player.currentPrompt();
  }

  formatPrompt() {
    const prompt = this.currentPrompt();

    if(!prompt) {
      return 'no prompt active';
    }

    const buttons = prompt.buttons.map(button => `[ ${button.text} ]`).join('\n');
    return `${prompt.menuTitle}\n${buttons}`;
  }

  findCardByName(name, location = 'any') {
    return this.filterCardsByName(name, location)[0];
  }

  filterCardsByName(name, location = 'any') {
    const matchFunc = matchCardByNameAndPack(name);
    const cards = this.player.allCards.filter(card => matchFunc(card.cardData) && (location === 'any' || card.location === location));

    if(cards.length === 0) {
      const locationString = location === 'any' ? 'any location' : location;
      throw new Error(`Could not find any matching card "${name}" for ${this.player.name} in ${locationString}`);
    }

    return cards;
  }

  findCard(condition) {
    return this.filterCards(condition)[0];
  }

  filterCards(condition) {
    const cards = this.player.allCards.filter(condition);

    if(cards.length === 0) {
      throw new Error(`Could not find any matching cards for ${this.player.name}`);
    }

    return cards;
  }

  hasPrompt(title) {
    const currentPrompt = this.player.currentPrompt();
    return !!currentPrompt && currentPrompt.menuTitle.toLowerCase() === title.toLowerCase();
  }

  selectDeck(deck) {
    this.game.selectDeck(this.player.name, deck);
  }

  clickPrompt(text) {
    const currentPrompt = this.player.currentPrompt();
    console.log(currentPrompt.menuTitle);
    const promptButton = currentPrompt.buttons.find(button => button.text.toLowerCase() === text.toLowerCase());

    if(!promptButton) {
      throw new Error(`Couldn't click on "${text}" for ${this.player.name}. Current prompt is:\n${this.formatPrompt()}`);
    }
    console.log(currentPrompt.menuTitle);
    this.game.menuButton(this.player.name, promptButton.arg, promptButton.method);
    this.game.continue();
  }

  clickCard(card, location = 'any') {
    if (typeof card === 'string') {
      card = this.findCardByName(card, location); // eslint-disable-line no-param-reassign
    }
    this.game.cardClicked(this.player.name, card.uuid);
    this.game.continue();
  }

  clickMenu(card, menuText) {
    if(card instanceof String) {
      card = this.findCardByName(card);
    }

    const items = card.getMenu().filter(item => item.text === menuText);

    if(items.length === 0) {
      throw new Error(`Card ${card.name} does not have a menu item "${menuText}"`);
    }

    this.game.menuItemClick(this.player.name, card.uuid, items[0]);
    this.game.continue();
  }

  dragCard(card, targetLocation) {
    this.game.drop(this.player.name, card.uuid, card.location, targetLocation);
    this.game.continue();
  }

  togglePromptedActionWindow(window, value) {
    this.player.promptedActionWindows[window] = value;
  }

  toggleKeywordSettings(setting, value) {
    this.player.keywordSettings[setting] = value;
  }
}
