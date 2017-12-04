import EventCard from '../../event-card';

export default class BladeMastery extends EventCard {
  setupCardAbilities() {
    this.action({
      target: card => this.cardCondition(card),
      handler: context => {
        this.untilEndOfPhase(ability => ({
          match: context.event.target,
          effects: [ability.effects.modifyAttack(1), ability.effects.modifyDefense(1)]
        }));
      }
    })
  }
}
