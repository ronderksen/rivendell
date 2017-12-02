import AllPlayerPrompt from '../../prompts/all-player-prompt';
import { onPlayerKeepHandOrMulligan } from '../../events';

export default class KeepOrMulliganPrompt extends AllPlayerPrompt {
  activePrompt() {
    return {
      menuTitle: 'Do you want to keep your hand or mulligan?',
      buttons: [
        { arg: 'keep', text: 'Keep hand' },
        { arg: 'mulligan', text: 'Mulligan' }
      ],
    };
  }

  waitingPrompt() {
    return {
      menuTitle: 'Waiting for other players to keep hand or mulligan',
    }
  }

  onMenuCommand(player, arg) {
    if(arg === 'keep') {
      player.keep();
      this.game.addMessage('{0} has kept their hand', player);
    } else if(arg === 'mulligan' && player.mulligan()) {
      this.game.addMessage('{0} has taken a mulligan', player);
    }
    this.game.raiseEvent(onPlayerKeepHandOrMulligan, { player: player, choice: arg });
  }
}
