import HeroCard from '../../hero-card';

export default class Gimli extends HeroCard {
  setCardAbilities(ability) {
    this.persistentEffect({
      effect: ability.effects.modifyAttack(this.wounds)
    });
  }
}
