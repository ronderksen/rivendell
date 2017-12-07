import uuid from 'uuid';
import PlayerCards from './index';

jest.mock('uuid');
uuid.v1 = jest.fn().mockReturnValue('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

describe('All cards', () => {
  let gameSpy;
  let playerSpy;

  beforeEach(() => {
    gameSpy = {
      scenario: {
        getActiveLocation: jest.fn(),
      },
      on: jest.fn(),
      removeListener: jest.fn(),
      addMessage: jest.fn(),
    };
    playerSpy = jest.fn();
    playerSpy.game = gameSpy;
    // this.gameSpy = jasmine.createSpyObj('game', ['on', 'removeListener', 'addPower', 'addMessage', 'addEffect', 'getOtherPlayer']);
    // this.playerSpy = jasmine.createSpyObj('player', ['registerAbilityMax']);
    // this.playerSpy.game = this.gameSpy;
  });

  Object.values(PlayerCards).forEach(cardClass => {
    it(`should be able to create '${cardClass.name}' and set it up`, () => {
      // No explicit assertion - if this throws an exception it will fail
      // and give us a better stacktrace than the expect().not.toThrow()
      // assertion.
      new cardClass(playerSpy, {});
    });
  });
});
