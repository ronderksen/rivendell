export default class BaseAbility {
  constructor(properties) {
    this.cost = this.buildCost(properties.cost);
    this.targets = this.buildTargets(properties);
    this.chooseOpponentFunc = properties.chooseOpponent;
  }

  buildCost(cost) {
    if(!cost) {
      return [];
    }

    if(!Array.isArray(cost)) {
      return [cost];
    }

    return cost;
  }

  buildTargets(properties) {
    if(properties.target) {
      return {
        target: properties.target
      };
    }

    if(properties.targets) {
      return properties.targets;
    }

    return {};
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
      if(cost.resolve) {
        return cost.resolve(context);
      }

      return { resolved: true, value: cost.canPay(context) };
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
   * Returns whether the ability requires an opponent to be chosen.
   */
  needsChooseOpponent() {
    return !!this.chooseOpponentFunc;
  }

  /**
   * Returns whether there are opponents that can be chosen, if the ability
   * requires that an opponent be chosen.
   */
  canResolveOpponents(context) {
    if(!this.needsChooseOpponent()) {
      return true;
    }

    return context.game.getPlayers().some(player => {
      return player !== context.player && this.canChooseOpponent(player);
    });
  }

  /**
   * Returns whether a specific player can be chosen as an opponent.
   */
  canChooseOpponent(opponent) {
    if(typeof this.chooseOpponentFunc === 'function') {
      return this.chooseOpponentFunc(opponent);
    }

    return this.chooseOpponentFunc === true;
  }

  /**
   * Returns whether there are eligible cards available to fulfill targets.
   *
   * @returns {Boolean}
   */
  canResolveTargets(context) {
    const ValidTypes = ['character', 'attachment', 'location', 'event'];
    return this.targets.every(target => {
      return context.game.allCards.any(card => {
        if(!ValidTypes.includes(card.getType())) {
          return false;
        }

        return target.cardCondition(card, context);
      });
    });
  }

  /**
   * Prompts the current player to choose each target defined for the ability.
   *
   * @returns {Array} An array of target resolution objects.
   */
  resolveTargets(context) {
    return this.targets.map((targetProperties, name) => {
      return this.resolveTarget(context, name, targetProperties);
    });
  }

  resolveTarget(context, name, targetProperties) {
    const { cardCondition, otherProperties } = targetProperties;
    const result = { resolved: false, name: name, value: null };
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
   * Executes the ability once all costs have been paid. Inheriting classes
   * should override this method to implement their behavior; by default it
   * does nothing.
   */
  executeHandler(context) { // eslint-disable-line no-unused-vars
  }

  isAction() {
    return true;
  }

  isPlayableEventAbility() {
    return false;
  }

  isCardAbility() {
    return true;
  }

  hasMax() {
    return false;
  }
}
