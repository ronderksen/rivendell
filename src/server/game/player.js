import Deck from './player-deck';
import { onCardReadied, onCardExhausted } from './events';
import PlayerPromptState from './prompts/player-prompt-state';
import {locations, phases} from "./constants";

export default class Player {
  constructor(id, user, isOwner, game) {
    this.id = id;
    this.user = user;
    this.name = user.username;
    this.isOwner = isOwner;
    this.game = game;
    this.left = false;
    this.deck = {};
    this.hand = [];
    this.heroes = [];
    this.drawDeck = [];
    this.allCards = [];
    this.promptState = new PlayerPromptState();
  }

  initialize() {
    if (this.deck.selected) {
      this.prepareDeck();
    }
  }

  prepareDeck() {
    const deck = new Deck(this.deck);
    this.preparedDeck = deck.prepare(this);
    this.heroes = this.preparedDeck.heroes;
    this.drawDeck = this.preparedDeck.drawCards;
    this.allCards = this.preparedDeck.allCards;
  }

  selectDeck(deck) {
    this.deck.selected = false;
    this.deck = deck;
    this.deck.selected = true;
  }

  drawCards(count) {
    if (this.drawDeck.length > 0) {
      return this.drawDeck.splice(0, count);
    }
    return [];
  }

  drawCardsToHand(numCards = 1) {
    if(numCards > this.drawDeck.length) {
      numCards = this.drawDeck.length; // eslint-disable-line no-param-reassign
    }

    const cards = this.drawCards(numCards);

    cards.forEach(card => {
      this.moveCard(card, locations.hand);
    });

    if(this.game.currentPhase !== phases.setup) {
      this.game.raiseEvent('onCardsDrawn', { cards, player: this });
    }

    return (cards.length > 1) ? cards : cards[0];
  }

  moveCard(card, targetLocation, options = {}, callback) {
    const targetPile = this.getSourceList(targetLocation);

    const opts = Object.assign({ allowSave: false, bottom: false, isDupe: false }, options);

    if(!targetPile) {
      return;
    }

    if(card.location === locations.playArea) {
      if(card.owner !== this) {
        card.owner.moveCard(card, targetLocation);
        return;
      }

      const params = {
        player: this,
        card,
        allowSave: opts.allowSave,
        automaticSaveWithDupe: true
      };

      this.game.raiseEvent('onCardLeftPlay', params, () => {
        this.synchronousMoveCard(card, targetLocation, opts);

        if(callback) {
          callback();
        }
      });
      return;
    }

    this.synchronousMoveCard(card, targetLocation, opts);
    if(callback) {
      callback();
    }
  }

  synchronousMoveCard(card, targetLocation, options = {}) {
    this.removeCardFromPile(card);

    const targetPile = this.getSourceList(targetLocation);

    if(!targetPile || targetPile.indexOf(card) > -1) {
      return;
    }

    if(card.location === locations.playArea) {
      card.attachments.each(attachment => {
        this.removeAttachment(attachment, false);
      });

      if(card.parent) {
        card.parent.removeAttachment(card);
      }
    }

    if([locations.playArea].includes(card.location)) {
      card.leavesPlay();
    }

    if(card.parent) {
      card.parent.removeAttachment(card);
    }

    card.moveTo(targetLocation);

    if(targetLocation === locations.playerDrawDeck && !options.bottom) {
      targetPile.unshift(card);
    } else {
      targetPile.push(card);
    }

    if([locations.playerDiscardPile].includes(targetLocation)) {
      this.game.raiseEvent('onCardPlaced', { card, location: targetLocation, player: this });
    }
  }

  removeCardFromPile(card) {
    if(card.controller !== this) {
      const oldController = card.controller;
      oldController.removeCardFromPile(card);

      oldController.allCards = oldController.allCards.filter(c => c !== card);
      this.allCards.push(card);
      card.controller = card.owner;

      return;
    }

    const originalLocation = card.location;
    let originalPile = this.getSourceList(originalLocation);

    if(originalPile) {
      originalPile = this.removeCardByUuid(originalPile, card.uuid);
      this.updateSourceList(originalLocation, originalPile);
    }
  }

  removeCardByUuid(list, uuid) {
    return list.filter(card => card.uuid !== uuid);
  }

  getSourceList(source) {
      switch(source) {
        case locations.hand:
          return this.hand;
        case locations.playerDrawDeck:
          return this.drawDeck;
        case locations.playerDiscardPile:
          return this.discardPile;
        case locations.playArea:
          return this.cardsInPlay;
        case locations.outOfGame:
          return this.outOfGamePile;
        default:
          return null;
      }
  }

  updateSourceList(source, targetList) {
    switch(source) {
      case locations.hand:
        this.hand = targetList;
        break;
      case locations.playerDrawDeck:
        this.drawDeck = targetList;
        break;
      case locations.playerDiscardPile:
        this.discardPile = targetList;
        break;
      case locations.playArea:
        this.cardsInPlay = targetList;
        break;
      case locations.outOfGame:
        this.outOfGamePile = targetList;
        break;
      default:
        break;
    }
  }

  modifyThreatCount(value) {
    this.threatCount += value;
  }

  readyCard(card) {
    if (!card.exhausted) {
      return;
    }

    this.game.applyGameAction('ready', card, c => {
      c.ready();

      this.game.raiseEvent(onCardReadied, { player: this, card });
    });
  }

  exhaustCard(card) {
    if (card.exhausted) {
      return;
    }

    this.game.applyGameAction('exhaust', card, c => {
      c.exhaust();

      this.game.raiseEvent(onCardExhausted, { player: this, card });
    });
  }

  currentPrompt() {
    return this.promptState.getState();
  }

  setPrompt(prompt) {
    this.promptState.setPrompt(prompt);
  }

  cancelPrompt() {
    this.promptState.cancelPrompt();
  }

  canSelectAsFirstPlayer(player) {}

  keep() {

  }

  mulligan() {

  }

  setupDone() {
    this.cardsInPlay.forEach(card => {
      card.flip(true);
    });

    this.resources = 0;
  }
}
