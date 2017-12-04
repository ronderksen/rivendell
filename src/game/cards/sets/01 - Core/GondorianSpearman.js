import AllyCard from '../../ally-card';
import { onDeclareDefender } from '../../../events';

export default class GondorianSpearman extends AllyCard {
  static code = '01-029';

  setCardAbilities() {
    this.response({
      when: {
        [onDeclareDefender]: event => event.target === this,
      },
      handler() {
        this.game.currentAttack.attacker.modifyWounds(1)
      }
    })
  }
}
