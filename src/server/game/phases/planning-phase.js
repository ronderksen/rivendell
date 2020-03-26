import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';
import PlanningPrompt from './planning/planning-prompt';
import {phases} from "../constants";

export default class PlanningPhase extends Phase {
  constructor(game) {
    super(game, phases.planning);

    this.initialize([
      new SimpleStep(game, () => this.beginPlanning()),
      new SimpleStep(game, () => this.promptForPlanning())
    ]);
  }

  beginPlanning() {
    this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
  }

  promptForPlanning() {
    const currentPlayer = this.remainingPlayers.shift();
    currentPlayer.beginPlanning();
    // even though the game rules allow actions during the planning step of another
    // player, I don't implement it here, because it would slow down the game too much
    // and I don't think it really matters if you do the action right after a card is played
    // or after a player is finished with their planning.
    this.game.queueStep(new PlanningPrompt(this.game, currentPlayer));
    this.game.queueStep(new ActionWindow(this.game, `After ${currentPlayer.name}'s planning`, 'Planning'));
    return this.remainingPlayers.length === 0;
  }

}
