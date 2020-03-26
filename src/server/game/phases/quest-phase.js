import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';
import CommitmentPrompt from './quest/commitment';
import {phases} from "../constants";

export default class QuestPhase extends Phase {
  constructor(game) {
    super(game, phases.quest);

    this.initialize([
      new SimpleStep(game, () => this.beginQuesting()),
      new SimpleStep(game, () => this.promptForCommitment()),
      new SimpleStep(game, () => this.revealEncounterCards()),
      new ActionWindow(game, 'After encounter cards have been revealed', 'Quest'),
      new SimpleStep(game, () => this.resolveQuesting()),
      new ActionWindow(game, 'After quest has been resolved', 'Quest'),
    ]);
  }

  beginQuesting() {
    this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
  }

  promptForCommitment() {
    const currentPlayer = this.remainingPlayers.shift();
    currentPlayer.beginPlanning();
    this.game.queueStep(new CommitmentPrompt(this.game, currentPlayer));
    this.game.queueStep(new ActionWindow(this.game, `After ${currentPlayer.name}'s  quest commitment`, 'Quest'))
    return this.remainingPlayers.length === 0;
  }

  revealEncounterCards() {
    this.game.getPlayersInFirstPlayerOrder().forEach(() => {
      this.game.revealEncounterCards();
    });
  }

  resolveQuesting() {
    const players = this.game.getPlayersInFirstPlayerOrder();
    const totalWillpower = players
      .reduce((acc, player) => acc + player.getCommittedWillpower(), 0);
    const totalThreatStrength = this.game.getStagedCards()
      .reduce((acc, card) => acc + card.threatStrength, 0);

    const diff = totalWillpower - totalThreatStrength;
    if (diff > 0) {
      this.game.addProgress(diff);
      this.game.addMessage(`Quest successful: players add ${diff} progress to the quest`);
    } else if (diff < 0) {
      players.forEach(player => player.modifyThreatCount(diff));
      this.game.addMessagE(`Quest failed: player threat count increased by ${diff}`);
    }
  }
}
