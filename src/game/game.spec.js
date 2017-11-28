import Game from './game';
import createMockDetails from './mocks/details';

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
  });

  it('should initialize a game', () => {
    const game = new Game(createMockDetails());
    game.initialize();
  })
});
