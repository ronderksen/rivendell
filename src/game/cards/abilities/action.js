import { cardTypes, locations } from '../../constants';
import BaseAbility from './base-ability';
import Costs from '../costs';
import EventRegistrar from '../event-registrar';

/**
 * Represents an action ability provided by card text.
 *
 * Properties:
 * title        - string that is used within the card menu associated with this
 *                action.
 * condition    - optional function that should return true when the action is
 *                allowed, false otherwise. It should generally be used to check
 *                if the action can modify game state (step #1 in ability
 *                resolution in the rules).
 * cost         - object or array of objects representing the cost required to
 *                be paid before the action will activate. See Costs.
 * phase        - string representing which phases the action may be executed.
 *                Defaults to 'any' which allows the action to be executed in
 *                any phase.
 * location     - string indicating the location the card should be in in order
 *                to activate the action. Defaults to 'play area'.
 * limit        - optional AbilityLimit object that represents the max number of
 *                uses for the action as well as when it resets.
 * max          - optional AbilityLimit object that represents the max number of
 *                times the ability by card title can be used. Contrast with
 *                `limit` which limits per individual card.
 * anyPlayer    - boolean indicating that the action may be executed by a player
 *                other than the card's controller. Defaults to false.
 * clickToActivate - boolean that indicates the action should be activated when
 *                   the card is clicked.
 */

export default class CardAction extends BaseAbility {
  constructor(game, card, properties) {
    super(properties);

    const { event, ally, attachment, treachery, enemy, location } = cardTypes;
    const { hand, playArea, stagingArea } = locations;

    const DefaultLocationForType = {
      [ally]: playArea,
      [attachment]: playArea,
      [event]: hand,
      [treachery]: stagingArea,
      [enemy]: stagingArea,
      [location]: stagingArea
    };

    this.game = game;
    this.card = card;
    this.title = properties.title;
    this.limit = properties.limit;
    this.max = properties.max;
    this.phase = properties.phase || 'any';
    this.anyPlayer = properties.anyPlayer || false;
    this.condition = properties.condition;
    this.clickToActivate = !!properties.clickToActivate;
    this.location = properties.location || DefaultLocationForType[card.getType()] || 'play area';
    this.events = new EventRegistrar(game, this);
    this.activationContexts = [];
    this.setHandler(card, properties);

    if(card.getType() === cardTypes.event) {
      this.cost.push(Costs.playEvent());
    }

    if(this.max) {
      this.card.owner.registerAbilityMax(this.card.name, this.max);
    }
  }

  setHandler(card, properties) { // eslint-disable-line class-methods-use-this
    if(!properties.handler) {
      throw new Error('Actions must have a `handler` property.');
    }

    this.handler = properties.handler;
  }

  allowMenu() {
    const { playArea } = locations;
    return this.location === playArea;
  }

  createContext(player, arg) {
    return {
      arg,
      player,
      game: this.game,
      source: this.card
    };
  }

  meetsRequirements(context) {
    const { event } = cardTypes;
    if(this.phase !== 'any' && this.phase !== this.game.currentPhase || this.game.currentPhase === 'setup') {
      return false;
    }

    if(context.player.cannotTriggerCardAbilities) {
      return false;
    }

    if(this.limit && this.limit.isAtMax()) {
      return false;
    }

    if(context.player !== this.card.controller && !this.anyPlayer) {
      return false;
    }
    
    if(this.card.getType() === event && !context.player.isCardInPlayableLocation(this.card, 'play')) {
      return false;
    }

    if(this.card.getType() !== event && this.location !== this.card.location) {
      return false;
    }

    if(this.card.isBlank()) {
      return false ;
    }

    if(this.condition && !this.condition()) {
      return false;
    }

    return this.canPayCosts(context) && this.canResolveTargets(context);
  }


  execute(player, arg) {
    const context = this.createContext(player, arg);

    if(!this.meetsRequirements(context)) {
      return false;
    }

    this.activationContexts.push(context);

    this.game.resolveAbility(this, context);

    return true;
  }

  executeHandler(context) {
    const success = this.handler(context);
    if(success !== false && this.limit) {
      this.limit.increment();
    }
  }
}
