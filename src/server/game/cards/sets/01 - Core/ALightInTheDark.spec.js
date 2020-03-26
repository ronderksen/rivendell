import {locations} from "../../../constants";

describe('Card: A light in the dark', () => {
  const wrapper = {};
  integration(wrapper, () => {
    beforeEach(() => {
      const deck = wrapper.buildDeck([
        'Aragorn',
        'Gimli',
        'Legolas',
      ], [
        'A light in the dark'
      ]);
      const encounterDeck = wrapper.buildEncounterDeck([
        'Hill troll',
      ]);
      wrapper.player1.selectDeck(deck);
      wrapper.game.setScenario(1);
      wrapper.startGame();
      wrapper.skipSetupPhase();
      wrapper.completeResourcePhase();
      wrapper.completePlanningPhase();
      wrapper.completeQuestPhase();
      wrapper.completeTravelPhase();
      wrapper.game.scenario.engageEnemies();
    });

    describe('when A light in the dark is played', () => {
      beforeEach(() => {
        wrapper.player1.clickCard('A light in the dark', locations.hand);
      });

      it('should prompt to select an engaged enemy', () => {
        // expect(wrapper.player1).toHavePrompt('Select engaged enemy');
      });

      describe.skip('when the player selects Hill troll', () => {
        beforeEach(() => {
          wrapper.player1.clickCard('Hill troll');
        });

        it('should move Hill Troll back to the staging area', () => {
          expect(wrapper.game.findCardByName('Hill Troll')).toHaveLocation(locations.stagingArea);
        });
      })
    });

  });
});
