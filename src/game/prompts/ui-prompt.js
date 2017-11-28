import BaseStep from '../phases/base-step';

export default class UiPrompt extends BaseStep {
  constructor(game) {
    super(game);
    this.completed = false;
  }

  isComplete() {
    return this.completed;
  }

  complete() {
    this.completed = true;
  }

  setPrompt() {
    this.game.getPlayers().forEach(player => {
      if(this.activeCondition(player)) {
        player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt()));
      } else {
        player.setPrompt(this.addDefaultCommandToButtons(this.waitingPrompt()));
      }
    });
  }

  activeCondition() {
    return true;
  }

  activePrompt() {
  }

  addDefaultCommandToButtons(original) {
    const prompt = Object.assign({}, original);
    if(prompt.buttons) {
      prompt.buttons.forEach(button => {
        button.command = button.command || 'menuButton';
      });
    }
    return prompt;
  }

  waitingPrompt() {
    return { menuTitle: 'Waiting for opponent' };
  }

  continue() {
    const completed = this.isComplete();

    if(completed) {
      this.clearPrompts();
    } else {
      this.setPrompt();
    }

    return completed;
  }

  clearPrompts() {
    this.game.getPlayers().forEach(player => {
      player.cancelPrompt();
    });
  }
}
