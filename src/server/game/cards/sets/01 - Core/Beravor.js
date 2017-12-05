import HeroCard from '../../hero-card';

export default class Beravor extends HeroCard {
  static code = '116-012';

  setupCardAbilities(ability) {
    this.action({
      cost: ability.costs.exhaustSelf(),
      choosePlayer: true,
      handler: (context) => {
        context.target.drawCards(2);
      }
    });
  }
}
