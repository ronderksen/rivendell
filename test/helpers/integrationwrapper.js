import DeckBuilder from "./deckbuilder";
import GameFlowWrapper from './game-flow-wrapper';

const ProxiedGameFlowWrapperMethods = [
  'startGame', 'keepStartingHands', 'skipSetupPhase', 'selectFirstPlayer',
  'completeSetupPhase', 'completeResourcePhase', 'completePlanningPhase',
  'completeQuestPhase', 'completeTravelPhase', 'completeEncounterPhase',
  'completeCombatPhase', 'completeRefreshPhase', 'completeSetup',
  'skipActionWindow', 'undefendedCombat'
];

const deckBuilder = new DeckBuilder();

global.integration = function integration(wrapper, options, definitions) {
  if (typeof options === 'function') {
    /* eslint-disable no-param-reassign */
    definitions = options;
    options = {};
    /* eslint-enable no-param-reassign */
  }

  describe('integration', () => {
    beforeEach(() => {
      wrapper.flow = new GameFlowWrapper(options);

      wrapper.game = wrapper.flow.game;
      wrapper.flow.allPlayers.forEach(player => {
        wrapper[player.name] = player;
        wrapper[`${player.name}Object`] = wrapper.game.getPlayerByName(player.name);
      });

      ProxiedGameFlowWrapperMethods.forEach(method => {
        wrapper[method] = (...args) => wrapper.flow[method](...args);
      });

      wrapper.buildDeck = (heroes, cards) => deckBuilder.buildDeck(heroes, cards);
      wrapper.buildEncounterDeck = cards => deckBuilder.buildEncounterDeck(cards);
    });

    definitions();
  });
};
