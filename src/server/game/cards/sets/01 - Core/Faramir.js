import AllyCard from '../../ally-card';

export default class Faramir extends AllyCard {
  static code = '01-014';

  setCardAbilities(ability) {
    this.action({
      cost: ability.costs.exhaustSelf(),
      choosePlayer: true,
      targets: {
        cardCondition: (card, context) => this.cardCondition(card, context)
      },
      handler: context => {
        this.untilEndOfPhase(() => ({
          match: context.targets,
          effect: ability.effects.modifyWillpower(1)
        }));
      }
    });
  }

  cardCondition(card, context) {
    return (
      card.owner === context.player &&
      card.isCharacter() &&
      card.isCommittedToQuest()
    );
  }
}
