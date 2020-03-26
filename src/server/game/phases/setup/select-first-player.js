import UiPrompt from '../../prompts/ui-prompt';
import { onFirstPlayerSelect } from '../../events';

export default class SelectFirstPlayerPrompt extends UiPrompt {
  constructor(game, player) {
    super(game);

    this.player = player;
  }

  activeCondition(player) {
    return player === this.player;
  }

  activePrompt() {
    return {
      menuTitle: 'Select first player',
      buttons: this.getFirstPlayerChoices()
        .map(player => ({ text: player.name, arg: player.name }))
    };
  }

  getFirstPlayerChoices() {
    const opponents = this.game.getPlayers().filter(player => player !== this.player);
    return [this.player].concat(opponents);
  }

  onMenuCommand(player, playerName) {
    if(player !== this.player) {
      return false;
    }

    const firstPlayer = this.game.getPlayerByName(playerName);
    if(firstPlayer) {
      this.game.getPlayers().forEach(p => {
        p.firstPlayer = firstPlayer === player; // eslint-disable-line no-param-reassign
      });

      this.game.addMessage('{0} has selected {1} to be the first player', player, firstPlayer);
      this.game.raiseEvent(onFirstPlayerSelect, {player: firstPlayer});

      this.complete();
    }

    return false;
  }
}
