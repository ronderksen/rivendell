import HeroCard from '../../hero-card';
import {locations} from "../../../constants";
import { onCharacterAttacking } from '../../../events';

export default class Dunhere extends HeroCard {
  static code = '116-009';

  setupCardAbilities(ability) {
    this.persistentEffect({
      when: {
        [onCharacterAttacking]: () => true,
      },
      condition: this.effectCondition,
      effect: ability.effect.modifyAttack(1)
    });
  }

  effectCondition() {
    const { attackers, defender } = this.game.currentAttack;
    return (
      defender.location === locations.stagingArea &&
      attackers.length === 1 &&
      attackers.includes(this)
    );
  };
}
