import CardAction from './action';
import { phases, locations, cardTypes } from '../../constants';
import Costs from '../costs';

jest.mock('../event-registrar');
jest.mock('../costs');
Costs.playEvent = jest.fn().mockImplementation(() => ({
  canPay: jest.fn().mockReturnValue(true)
}));

const ability = {
  costs: {
    payResource: jest.fn().mockImplementation(() => ({
      canPay: jest.fn().mockReturnValue(true)
    }))
  }
};

const Game = jest.fn().mockImplementation((allCards) => ({
  allCards,
  currentPhase: phases.planning,
}));
const Card = jest.fn().mockImplementation((controller, cardType) => ({
  controller,
  location: locations.engagementArea,
  isBlank: jest.fn().mockReturnValue(false),
  getType: jest.fn().mockReturnValue(cardType),
}));
const Player = jest.fn().mockImplementation(() => ({
  cannotTriggerAbilities: false,
  isCardInPlayableLocation: jest.fn().mockReturnValue(true),
}));

describe('Class: CardAction', () => {
  let game;
  let card;
  let player;

  beforeEach(() => {
    game = new Game([new Card(null, cardTypes.enemy)]);
    player = new Player();
    card = new Card(player, cardTypes.event);
  });
  it('should create a new action', () => {
    const props = {
      title: 'Test action',
      target: {
        cardCondition: c => c.getType() === cardTypes.enemy &&
          c.location === locations.engagementArea
      },
      condition: jest.fn().mockReturnValue(true),
      cost: [ability.costs.payResource(1)],
      phase: phases.planning,
      location: locations.playArea,
      clickToActivate: true,
      handler: jest.fn(),
    };

    const action = new CardAction(game, card, props);
    expect(action.title).toBe(props.title);
    expect(Costs.playEvent).toHaveBeenCalled();
  });

  it('should check if the action can be executed', () => {
    const props = {
      title: 'Test action',
      target: {
        cardCondition: c => c.getType() === cardTypes.enemy &&
          c.location === locations.engagementArea
      },
      condition: jest.fn().mockReturnValue(true),
      cost: [ability.costs.payResource(1)],
      phase: phases.planning,
      location: locations.playArea,
      clickToActivate: true,
      handler: jest.fn(),
    };

    const action = new CardAction(game, card, props);
    const context = action.createContext(player, {});
    expect(action.meetsRequirements(context)).toBe(true);
  });
});
