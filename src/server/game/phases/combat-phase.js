import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';
import {phases} from "../constants";

export default class CombatPhase extends Phase {
  constructor(game) {
    super(game, phases.combat);

    this.initialize([
      new ActionWindow(this.game, 'After combat phase', 'Combat'),
    ])
  }
}
