import Phase from './phase';
import SimpleStep from './simple-step';
import ActionWindow from './action-window';
import {cardTypes, phases} from '../constants';
import LocationPrompt from './travel/location-prompt'

export default class TravelPhase extends Phase {
  constructor(game) {
    super(game, phases.travel);

    this.initialize([
      new SimpleStep(this.game, () => this.travelToLocation()),
      new ActionWindow(this.game, 'After travel phase', 'Travel'),
    ])
  }

  travelToLocation() {
    if (this.game.scenario.getActiveLocation(false) === null && this.game.getStagedCards().find(c => c.getType() === cardTypes.location)) {
      this.game.queueStep(new LocationPrompt());
    }
  }
}

