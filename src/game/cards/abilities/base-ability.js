import {cardTypes} from '../../constants';

export default class BaseAbility {
  constructor(properties) {
    this.setCost(properties.cost);
    this.setTargets(properties);
    this.choosePlayerFunc = properties.choosePlayer;
  }

  setCost(cost) {
    if (!cost) {
      this.cost = [];
    }

    if (!Array.isArray(cost)) {
      this.cost = [cost];
    }

    this.cost = cost;
  }

  setTargets(properties) {
    this.targets = {};

    if (properties.target) {
      this.targets = {
        target: properties.target
      };
    }

    if (properties.targets) {
      this.targets = properties.targets;
    }
  }

  resolveTarget(context, name, targetProperties) { // eslint-disable-line class-methods-use-this
    const {cardCondition, otherProperties} = targetProperties;
    const result = {resolved: false, name, value: null};
    const promptProperties = {
      source: context.source,
      cardCondition: card => cardCondition(card, context),
      onSelect: (player, card) => {
        result.resolved = true;
        result.value = card;
        return true;
      },
      onCancel: () => {
        result.resolved = true;
        return true;
      }
    };
    context.game.promptForSelect(context.player, {
      ...promptProperties,
      ...otherProperties
    });
    return result;
  }

  /**
   * Return whether all costs are capable of being paid for the ability.
   *
   * @returns {Boolean}
   */
  canPayCosts(context) {
    return this.cost.every(cost => cost.canPay(context));
  }

  /**
   * Resolves all costs for the ability prior to payment. Some cost objects
   * have a `resolve` method in order to prompt the user to make a choice,
   * such as choosing a card to kneel. Consumers of this method should wait
   * until all costs have a `resolved` value of `true` before proceeding.
   *
   * @returns {Array} An array of cost resolution results.
   */
  resolveCosts(context) {
    return this.cost.map(cost => {
      if (cost.resolve) {
        return cost.resolve(context);
      }

      return {resolved: true, value: cost.canPay(context)};
    });
  }

  /**
   * Pays all costs for the ability simultaneously.
   */
  payCosts(context) {
    this.cost.forEach(cost => {
      cost.pay(context);
    });
  }

  /**
   * Return whether when unpay is implemented for the ability cost and the
   * cost can be unpaid.
   *
   * @returns {boolean}
   */
  canUnpayCosts(context) {
    return this.cost.every(cost => cost.unpay && cost.canUnpay(context));
  }

  /**
   * Unpays each cost associated with the ability.
   */
  unpayCosts(context) {
    this.cost.forEach(cost => {
      cost.unpay(context);
    });
  }

  /**
   * Returns whether the ability requires a player to be chosen.
   */

  needsChoosePlayer() {
    return !!this.choosePlayerFunc;
  }

  /**
   * Returns whether there are players that can be chosen, if the ability
   * requires that a player be chosen.
   */
  canResolvePlayers(context) {
    if (!this.needsChoosePlayer()) {
      return true;
    }

    return context.game.getPlayers().some(player => player !== context.player && this.canChooseOpponent(player));
  }

  /**
   * Returns whether a specific player can be chosen.
   */
  canChoosePlayer(opponent) {
    if (typeof this.choosePlayerFunc === 'function') {
      return this.choosePlayerFunc(opponent);
    }

    return this.choosePlayerFunc === true;
  }

  /**
   * Returns whether there are eligible cards available to fulfill targets.
   *
   * @returns {Boolean}
   */
  canResolveTargets(context) {
    const {event, ...ValidTypes} = cardTypes;
    return Object.values(this.targets).every(target => context.game.allCards.some(card => {
      if (!Object.values(ValidTypes).includes(card.getType())) {
        return false;
      }

      return target.cardCondition(card, context);
    }));
  }

  /**
   * Prompts the current player to choose each target defined for the ability.
   *
   * @returns {Array} An array of target resolution objects.
   */
  resolveTargets(context) {
    return this.targets.map((targetProperties, name) => this.resolveTarget(context, name, targetProperties));
  }

  /**
   * Executes the ability once all costs have been paid. Inheriting classes
   * should override this method to implement their behavior; by default it
   * does nothing.
   */
  executeHandler(context) { // eslint-disable-line no-unused-vars, class-methods-use-this
  }

  isAction() { // eslint-disable-line class-methods-use-this
    return true;
  }

  isPlayableEventAbility() { // eslint-disable-line class-methods-use-this
    return false;
  }

  isCardAbility() { // eslint-disable-line class-methods-use-this
    return true;
  }

  hasMax() { // eslint-disable-line class-methods-use-this
    return false;
  }
}
