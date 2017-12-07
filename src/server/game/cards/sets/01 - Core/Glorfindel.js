import HeroCard from '../../hero-card';

export default class Glorfindel extends HeroCard {
  static code = '116-011';

  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.payResource(),
      target: {
        activePromptTitle: 'Select a character',
        cardCondition: card => card.isCharacter(),
      },
      handler: (context) => {
       context.target.modifyWounds(-1);
      }
    });
  }
}
