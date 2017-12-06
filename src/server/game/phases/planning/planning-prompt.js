import UiPrompt from '../../prompts/ui-prompt';

export default class PlanningPrompt extends UiPrompt {
  constructor(game, player) {
    super(game);
    this.player = player;
  }

  activeCondition(player) {
    return this.player === player;
  }

  activePrompt() {
    return {
      menuTitle: 'Plan your cards',
      buttons: [
        { text: 'Done' }
      ]
    };
  }

  waitingPrompt() {
    return { menuTitle: 'Waiting for opponent to finish planning' };
  }

  onMenuCommand(player) {
    if(this.player !== player) {
      return false;
    }

    this.game.addMessage('{0} has finished planning', player);
    this.complete();
    return true;
  }
}
