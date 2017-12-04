import HeroCard from '../../hero-card';

export default class Glorfindel extends HeroCard {
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
