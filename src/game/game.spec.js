import Game from './game';
import createMockDetails from './mocks/details';

jest.mock('./game-pipeline');
import GamePipeline from './game-pipeline';

GamePipeline.mockImplementation(() => ({
  pipeline: [],
  queue: [],
  initialize: jest.fn(),
  queueStep: jest.fn(),
  continue: jest.fn(),
}));

jest.mock('./player');
import Player from './player';
import MockDeckFactory from './test-helpers/MockDeckFactory';
const preparedDeck = MockDeckFactory();

Player.mockImplementation((id, user, isOwner, game) => ({
  id,
  user,
  name: user.username,
  isOwner,
  game,
  left: false,
  preparedDeck,
  initialize: jest.fn(),
}));

jest.mock('./spectator');
import Spectator from './spectator';
Spectator.mockImplementation((id, user, game) => ({
  constructor: Spectator,
  id,
  user,
  game,
  left: false,
  initialize: jest.fn(),
}));

jest.mock('./scenario');
import Scenario from './scenario';
Scenario.mockImplementation(() => ({
  getEncounterSets: jest.fn().mockReturnValue([]),
  getQuestCards: jest.fn().mockReturnValue([]),
}));
jest.mock('./phases/setup-phase');
// jest.mock('./phases/simple-step');

describe('Class: Game', () => {
  const RealDate = global.Date;

  beforeEach(() => {
    const constantDate = new Date('2017-11-28T20:26:42.098Z');
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });

  afterEach(() => {
    global.Date = RealDate;
  });

  it('should instantiate given correct details', () => {
    const game = new Game(createMockDetails());
    expect(game).toBeInstanceOf(Game);
    expect(game).toMatchSnapshot();

    expect(Player).toHaveBeenCalledTimes(2);
    expect(Spectator).toHaveBeenCalledTimes(1);
    expect(game.scenario.getEncounterSets).toHaveBeenCalledTimes(1);
    expect(game.scenario.getQuestCards).toHaveBeenCalledTimes(1);
  });

  it('should get an array with all players', () => {
    const game = new Game(createMockDetails());
    const players = game.getPlayers();
    expect(players).toHaveLength(2);
    const names = players.map(player => player.user.username);
    expect(names).toEqual(['chevalric', 'darius']);
  });

  it('should initialize a game', () => {
    const game = new Game(createMockDetails());
    game.initialize();

    game.getPlayers().forEach(player => {
      expect(player.initialize).toHaveBeenCalledTimes(1);
      expect(player.preparedDeck).toEqual(preparedDeck);
    });

    expect(game.pipeline.initialize).toHaveBeenCalledTimes(1);
    expect(game.playStarted).toBe(true);
    expect(game.round).toBe(0);
    expect(game.pipeline.continue).toHaveBeenCalledTimes(1);
  })
});
