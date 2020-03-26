import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';
import {phases} from "../constants";

export default class RefreshPhase extends Phase {
  constructor(game) {
    super(game, phases.refresh);

    this.initialize([
      new SimpleStep(game, () => this.readyAllCards()),
      new SimpleStep(game, () => this.increaseAllThreatCounts()),
      new ActionWindow(this.game, 'After refresh phase', 'Refresh'),
    ])
  }

  readyAllCards() {}

  increaseAllThreatCounts() {}
}
