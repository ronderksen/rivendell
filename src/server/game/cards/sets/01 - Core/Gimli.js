import HeroCard from '../../hero-card';

export default class Gimli extends HeroCard {
  static code = '01-004';

  setCardAbilities(ability) {
    this.persistentEffect({
      effect: ability.effects.modifyAttack(this.wounds)
    });
  }
}