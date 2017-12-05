import HeroCard from '../../hero-card';

export default class Gimli extends HeroCard {
  static code = '116-004';

  setupCardAbilities(ability) {
    this.persistentEffect({
      effect: ability.effects.modifyAttack(this.wounds)
    });
  }
}
