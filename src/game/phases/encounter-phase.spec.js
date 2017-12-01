import EncounterPhase from './encounter-phase';
import { cardTypes } from '../constants';

jest.mock('./encounter/optional-engagement');
import OptionalEngagement from './encounter/optional-engagement';
OptionalEngagement.mockImplementation(() => ({
  continue: jest.fn().mockReturnValue(true)
}));

jest.mock('./action-window');
import ActionWindow from './action-window';
ActionWindow.mockImplementation(() => ({
  continue: jest.fn().mockReturnValue(true)
}));

jest.mock('./simple-step');
import SimpleStep from './simple-step';
SimpleStep.mockImplementation((game, continueFunc) => ({
  continue: jest.fn().mockReturnValue(continueFunc())
}));

function playersFactory(count) {
  const players = [{
      name: 'chevalric',
      threatCount: 28,
      engagedEnemies: [],
    },
    {
      name: 'darius',
      threatCount: 20,
      engagedEnemies: [],
    },
    {
      name: 'john',
      threatCount: 29,
      engagedEnemies: [],
    },
    {
      name: 'alex',
      threatCount: 25,
      engagedEnemies: []
    }
  ];
  return players.splice(0, count);
}

const lowThreatEnemy = {
  threat: 15,
  name: 'Hill Troll',
  type: cardTypes.enemy,
};

const highThreatEnemy = {
  threat: 40,
  name: 'Stone Giant',
  type: cardTypes.enemy,
};

const mockGame = (players, stagedCards) => ({
  getPlayers() {
    return players;
  },
  getPlayersInFirstPlayerOrder() {
    return players;
  },
  getStagedCards() {
    return stagedCards
  },
  reapplyStateDependentEffects: jest.fn(),
  raiseEvent: jest.fn(),
});

describe('Class: EncounterPhase', () => {
  it('should end immediately if no staged enemies', () => {
    const game = mockGame(playersFactory(2), []);
    const encounter = new EncounterPhase(game);
    const pipeline = [...encounter.pipeline.pipeline];
    encounter.continue();
    pipeline.forEach(step => {
      expect(step.continue).toHaveBeenCalledTimes(1);
    });
    expect(game.raiseEvent).toHaveBeenCalledWith('onAtEndOfPhase');
    expect(game.getPlayers()[0].engagedEnemies).toHaveLength(0);
    expect(game.getPlayers()[1].engagedEnemies).toHaveLength(0);
  });

  it('should engage the first player when staged enemy has lower threat', () => {
    const game = mockGame(playersFactory(2), [lowThreatEnemy]);
    const encounter = new EncounterPhase(game);
    encounter.continue();
    expect(game.raiseEvent).toHaveBeenCalledWith('onAtEndOfPhase');
    expect(game.getPlayers()[0].engagedEnemies).toHaveLength(1);
    expect(game.getPlayers()[0].engagedEnemies).toEqual([lowThreatEnemy]);
    expect(game.getPlayers()[1].engagedEnemies).toHaveLength(0);
  });

  it('should not engage any players if threat is too high', () => {
    const game = mockGame(playersFactory(2), [highThreatEnemy]);
    const encounter = new EncounterPhase(game);
    encounter.continue();
    expect(game.raiseEvent).toHaveBeenCalledWith('onAtEndOfPhase');
    expect(game.getPlayers()[0].engagedEnemies).toHaveLength(0);
    expect(game.getPlayers()[1].engagedEnemies).toHaveLength(0);
  });

  it('should divide enemies as equally as possible', () => {
    const game = mockGame(playersFactory(2), [{...lowThreatEnemy}, {...lowThreatEnemy}, {...lowThreatEnemy}]);
    const encounter = new EncounterPhase(game);
    encounter.continue();
    expect(game.raiseEvent).toHaveBeenCalledWith('onAtEndOfPhase');
    expect(game.getPlayers()[0].engagedEnemies).toHaveLength(2);
    expect(game.getPlayers()[1].engagedEnemies).toHaveLength(1);
  });

  it('should engage enemies as much as possible', () => {
    const game = mockGame(playersFactory(2), [{...highThreatEnemy}, {...lowThreatEnemy}, {...lowThreatEnemy}, {...lowThreatEnemy}]);
    const encounter = new EncounterPhase(game);
    encounter.continue();
    expect(game.raiseEvent).toHaveBeenCalledWith('onAtEndOfPhase');
    expect(game.getPlayers()[0].engagedEnemies).toHaveLength(2);
    expect(game.getPlayers()[1].engagedEnemies).toHaveLength(1);
  });

  it('should also still work with more than two players', () => {
    const game = mockGame(playersFactory(4), [
      {...highThreatEnemy},
      {...lowThreatEnemy},
      {...lowThreatEnemy},
      {...lowThreatEnemy},
      {...lowThreatEnemy},
      {
        ...lowThreatEnemy,
        threat: 29
      },
      {...lowThreatEnemy}
    ]);
    const encounter = new EncounterPhase(game);
    encounter.continue();
    expect(game.raiseEvent).toHaveBeenCalledWith('onAtEndOfPhase');
    expect(game.getPlayers()[0].engagedEnemies).toHaveLength(2);
    expect(game.getPlayers()[1].engagedEnemies).toHaveLength(1);
    expect(game.getPlayers()[2].engagedEnemies).toHaveLength(2);
    expect(game.getPlayers()[3].engagedEnemies).toHaveLength(1);
  })
});
