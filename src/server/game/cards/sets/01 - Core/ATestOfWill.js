import EventCard from '../../event-card';
import { onEncounterCardRevealed } from '../../../events';

export default class ATestOfWill extends EventCard {
  //  Response: Cancel the "when revealed" effects of a card that was just revealed from the encounter deck.
  setupCardAbilities() {
    this.interrupt({
      canCancel: true,
      when: {
        [onEncounterCardRevealed]: () => true,
      },
      target: {
        cardCondition: (card, context) => this.cardCondition(card, context),
      },
      handler: context => {
        context.event.cancelEffect(context.target);
        this.game.addMessage(`${context.player.name} uses ${this.name} to cancel ${context.target.name}'s 'When revealed' effect.`)
      }
    });
  }

  cardCondition(card, context) {
    return !context.event.cards.includes(card);
  }
}
