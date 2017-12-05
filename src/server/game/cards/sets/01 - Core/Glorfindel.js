import HeroCard from '../../hero-card';

export default class Glorfindel extends HeroCard {
  static code = '01-011';

  setCardAbilities(ability) {
    this.action({
      cost: ability.costs.payResource(),
      target: {
        activePromptTitle: 'Select a character',
        cardCondition: card => card.isCharacter(),
      },
      effect: ability.effects.heal(1)
    });
  }
}
