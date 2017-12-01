import PlayerOrderPrompt from '../prompts/player-order-prompt';

export default class ActionWindow extends PlayerOrderPrompt {
  constructor(game, title, windowName) {
    super(game);

    this.title = title;
    this.windowName = windowName;
  }

  continue() {
    let completed = super.continue();

    if(!completed) {
      this.game.currentActionWindow = this;
    } else {
      this.game.currentActionWindow = null;
    }

    return completed;
  }

  activePrompt() {
    return {
      menuTitle: 'Initiate an action',
      buttons: [
        { text: 'Pass' }
      ],
      promptTitle: this.title
    };
  }

  skipCondition(player) {
    return !this.forceWindow && !player.promptedActionWindows[this.windowName];
  }

  onMenuCommand(player) {
    if(this.currentPlayer !== player) {
      return false;
    }

    this.completePlayer();

    return true;
  }

  markActionAsTaken() {
    this.setPlayers(this.rotatedPlayerOrder(this.currentPlayer));
    this.forceWindow = true;
  }

  rotatedPlayerOrder(player) {
    const players = this.game.getPlayersInFirstPlayerOrder();
    const splitIndex = players.indexOf(player);
    const beforePlayer = players.slice(0, splitIndex);
    const afterPlayer = players.slice(splitIndex + 1);
    return afterPlayer.concat(beforePlayer).concat([player]);
  }
}
