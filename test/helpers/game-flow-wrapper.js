/* global jasmine */

import PlayerInteractionWrapper from "./playerinteractionwrapper";
import Game from "../../src/server/game/game";
import Settings from "../../src/server/settings";
import gameRouter from '../../src/server/game-router';
import { phases } from '../../src/server/game/constants';

jest.mock('../../src/server/game-router');
gameRouter.gameWon = jest.fn();
gameRouter.handleError = jest.fn((game, error) => {
  throw error;
});
gameRouter.playerLeft = jest.fn();

export default class GameFlowWrapper {
  constructor() {
    const details = {
      name: 'player1\'s game',
      id: 12345,
      owner: 'player1',
      saveGameId: 12345,
      scenarioId: 1,
      players: [
        { id: '111', user: Settings.getUserWithDefaultsSet({ username: 'player1' }) },
      ],
      spectators: []
    };
    this.game = new Game(details, { router: gameRouter });

    this.player1 = new PlayerInteractionWrapper(this.game, this.game.getPlayerByName('player1'));
    this.allPlayers = [this.player1];
  }

  eachPlayerInFirstPlayerOrder(handler) {
    const playersInOrder = this.allPlayers.sort(player => !player.firstPlayer);

    playersInOrder.forEach(player => handler(player));
  }

  startGame() {
    this.game.initialize();
  }

  keepStartingHands() {
    this.allPlayers.forEach(player => player.clickPrompt('Keep hand'));
  }

  skipSetupPhase() {
    this.selectFirstPlayer(this.game.getPlayers()[0]);
    this.keepStartingHands();
    // this.allPlayers.forEach(player => player.clickPrompt('Done'));
  }

  guardCurrentPhase(phase) {
    if(this.game.currentPhase !== phase) {
      throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
    }
  }

  completeSetupPhase() {
    this.guardCurrentPhase(phases.setup);
    // this.allPlayers.forEach(player => player.clickPrompt('Done'));
  }

  completeResourcePhase() {
    this.guardCurrentPhase(phases.resource);
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  completePlanningPhase() {
    this.guardCurrentPhase(phases.planning);
    // Each player clicks 'Done' when challenge initiation prompt shows up.
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  completeQuestPhase() {
    this.guardCurrentPhase(phases.quest);
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  completeTravelPhase() {
    this.guardCurrentPhase(phases.travel);
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  completeEncounterPhase() {
    this.guardCurrentPhase(phases.encounter);
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  completeCombatPhase() {
    this.guardCurrentPhase(phases.combat);
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  completeRefreshPhase() {
    this.guardCurrentPhase(phases.refresh);
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Done'));
  }

  skipActionWindow() {
    this.eachPlayerInFirstPlayerOrder(player => player.clickPrompt('Pass'));
  }

  getPromptedPlayer(title) {
    const promptedPlayer = this.allPlayers.find(p => p.hasPrompt(title));

    if(!promptedPlayer) {
      const promptString = this.allPlayers.map(player => `${player.name}: ${player.formatPrompt()}`).join('\n\n');
      throw new Error(`No players are being prompted with "${title}". Current prompts are:\n\n${promptString}`);
    }

    return promptedPlayer;
  }

  selectFirstPlayer(player) {
    const promptedPlayer = this.getPromptedPlayer('Select first player');
    promptedPlayer.clickPrompt(player.name);
  }
}
