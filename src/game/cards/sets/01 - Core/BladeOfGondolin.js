import AttachmentCard from '../../attachment-card';
import { onEnemyIsAttacked, onEnemyKilled } from '../../../events';

export default class BladeOfGondolin extends AttachmentCard {
  setupCardAbilities(ability) {
    this.whileAttached({
      condition: () => {
        const {target} = this.game.currentAttack;
        return target.isEnemy() && target.hasTrait('Orc')
      },
      recalculateWhen: [onEnemyIsAttacked],
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
