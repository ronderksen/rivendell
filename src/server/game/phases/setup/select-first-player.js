import AllPlayerPrompt from '../../prompts/all-player-prompt';
import { onFirstPlayerSelect } from '../../events';

export default class SelectFirstPlayerPrompt extends AllPlayerPrompt {
  activePrompt() {
    return {
      menuTitle: 'Who will go first?',
      buttons: this.game
        .getPlayers()
        .map(player => ({ arg: player.id, text: player.name })),
    };
  }

  waitingPrompt() {
    return {
      menuTitle: 'Waiting for other players to select start player',
    }
  }

  onMenuCommand(player, arg) {
    const selectedPlayer = this.game.getPlayers().find(p => p.id === arg);
    this.game.addMessage(`${player.name} has selected ${selectedPlayer.name} to go first.`);
    this.game.raiseEvent(onFirstPlayerSelect, { player, choice: arg });
  }
}
