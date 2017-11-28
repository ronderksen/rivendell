import UiPrompt from './ui-prompt';

export default class AllPlayerPrompt extends UiPrompt {
  activeCondition(player) {
    return !this.completionCondition(player);
  }

  completionCondition() {
    return false;
  }

  isComplete() {
    return this.game.getPlayers().every(player => {
      return this.completionCondition(player);
    });
  }
}
