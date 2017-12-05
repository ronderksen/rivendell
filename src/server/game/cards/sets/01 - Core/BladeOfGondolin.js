import AttachmentCard from '../../attachment-card';
import { onEnemyAttacking, onEnemyKilled } from '../../../events';

export default class BladeOfGondolin extends AttachmentCard {
  static code = '01-039';

  setupCardAbilities(ability) {
    this.whileAttached({
      condition: () => {
        const { target } = this.game.currentAttack;
        return target.isEnemy() && target.hasTrait('Orc')
      },
      recalculateWhen: [onEnemyAttacking],
      effect: ability.effects.modifyAttack(1)
    });
    this.response({
      when: {
        [onEnemyKilled]: context => context.enemy.hasTrait('Orc')
      },
      handler: context => {
        context.game.addProgressToken(1);
      }
    });
  }
}
