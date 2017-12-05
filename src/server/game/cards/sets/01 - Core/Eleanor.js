import HeroCard from '../../hero-card';
import {cardTypes} from "../../../constants";
import { onEncounterCardRevealed } from '../../../events';

export default class Eleanor extends HeroCard {
  static code = '116-008';

  setupCardAbilities(ability) {
    // Exhaust Eleanor to cancel the "when revealed" effects of a treachery card
    // just revealed by the encounter deck. Then, discard that card, and replace
    // it with the new card from the encounter deck.
    this.interrupt({
      when: {
        [onEncounterCardRevealed]: () => true,
      },
      cost: ability.costs.exhaustSelf(),
      target: {
        cardCondition: (card, context) => this.cardCondition(card, context),
      },
      handler: context => {
        context.event.cancelEffect(context.target);
        context.target.discard();
        this.game.scenario.drawEncounterCard();
        this.game.addMessage(`${context.player.name} uses ${this.name} to cancel ${context.target.name}'s 'When revealed' effect.`)
      }
    });
  }

  cardCondition(card, context) {
    return !context.event.cards.includes(card) && card.getType === cardTypes.treachery;
  }

}
