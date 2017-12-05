import ExhaustCost from './costs/exhaust-cost';
import SelfCost from './costs/self-cost';
import CostBuilders from './costs/cost-builders';
// import ParentCost from './costs/parent-cost';
import { locations } from '../constants';

const Costs = {
  all(...costs) {
    return {
      canPay(context) {
        return costs.every(cost => cost.canPay(context));
      },
      pay(context) {
        costs.every(cost => cost.pay(context));
      }
    };
  },
  exhaustSelf() {
    const action = new ExhaustCost();
    return new SelfCost(action);
  },

  /**
   * Cost that will place the played event card in the player's discard pile.
   */
  expendEvent() {
    return {
      canPay(context) {
        return context.player.isCardInPlayableLocation(context.source, 'play') && context.player.canPlay(context.source, 'play');
      },
      pay(context) {
        context.source.controller.moveCard(context.source, locations.playerDiscardPile);
      }
    };
  },

  payResource(amount, options) {
    return CostBuilders.discardResources(amount, options).self();
  },

  playEvent() {
    return Costs.all(
      Costs.expendEvent(),
      Costs.playLimited(),
      Costs.playMax()
    );
  },

  /**
   * Cost that ensures that the player can still play a Limited card this
   * round.
   */
  playLimited() {
    return {
      canPay(context) {
        return !context.source.isLimited() || context.player.limitedPlayed < context.player.maxLimited;
      },
      pay(context) {
        if(context.source.isLimited()) {
          context.player.limitedPlayed += 1; // eslint-disable-line no-param-reassign
        }
      }
    };
  },

  /**
   * Cost that ensures that the player has not exceeded the maximum usage for
   * an ability.
   */
  playMax() {
    return {
      canPay(context) {
        return !context.player.isAbilityAtMax(context.source.name);
      },
      pay(context) {
        context.player.incrementAbilityMax(context.source.name);
      }
    };
  },
};

export default Costs;
