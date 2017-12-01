import UiPrompt from './ui-prompt';

export default class PlayerOrderPrompt extends UiPrompt {
  activeCondition(player) {
    return !this.completionCondition(player);
  }

  completionCondition() {
    return false;
  }

  isComplete() {
    return this.game.getPlayersInFirstPlayerOrder().every(player => {
      return this.completionCondition(player);
    });
  }
}
