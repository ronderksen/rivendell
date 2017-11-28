import uuid from 'uuid';
import { phases, spheres } from '../constants';
import HeroCard from './hero-card';

describe('HeroCard', () => {
  const cardData = {
    name: 'Aragorn',
    sphere: spheres.leadership,
    isUnique: true,
    startingThreat: 12,
    willPower: 2,
    attack: 3,
    defense: 2,
    hitPoints: 5,
    traits: 'Dûnedain. Noble. Ranger.',
    keywords: 'Sentinel',
    setid: '01',
    num: '001',
  };
  const owner = {
    id: uuid.v1(),
    game: {
      addMessage: jest.fn()
    }
  };

  beforeEach(() => {
    owner.game.addMessage.mockReset();
  });

  it('should initialize correctly', () => {
    const { leadership } = spheres;
    const aragorn = new HeroCard(owner, cardData);
    expect(aragorn).toMatchObject({
      name: 'Aragorn',
      spheres: [leadership],
      isUnique: true,
      startingThreat: 12,
      willPower: 2,
      attack: 3,
      defense: 2,
      hitPoints: 5,
      code: '01-001',
      resources: 0,
    });
  });

  it('should be able to add resources', () => {
    const aragorn = new HeroCard(owner, cardData);
    aragorn.addResources();
    expect(aragorn.resources).toBe(1);
    aragorn.addResources(3);
    expect(aragorn.resources).toBe(4);
  });

  it('should be able to pay resources', () => {
    const aragorn = new HeroCard(owner, cardData);
    aragorn.addResources();
    expect(aragorn.resources).toBe(1);
    aragorn.payResources();
    expect(aragorn.resources).toBe(0);
    aragorn.addResources(5);
    expect(aragorn.resources).toBe(5);
    aragorn.payResources(3);
    expect(aragorn.resources).toBe(2);
  });

  it('should log a game message when an invalid sphere is used for a payment', () => {
    const aragorn = new HeroCard(owner, cardData);
    aragorn.addResources();
    aragorn.payResources(1, spheres.lore);
    expect(owner.game.addMessage).toHaveBeenCalledWith('Aragorn can\'t pay lore resources');
    expect(aragorn.resources).toBe(1);
  });

  it('should be able to have multiple spheres', () => {
    const { leadership, lore } = spheres;
    const aragorn = new HeroCard(owner, cardData);
    aragorn.addResourceIcon(lore);
    expect(aragorn.spheres).toEqual([
      leadership,
      lore,
    ]);
  });

  it('should log a game message when an invalid sphere is used', () => {
    const aragorn = new HeroCard(owner, cardData);
    aragorn.addResourceIcon('moria');
    expect(owner.game.addMessage).toHaveBeenCalledWith('Unable to add sphere \'moria\' to Aragorn');
  });

  it('should set up response abilities properly', () => {
    class Aragorn extends HeroCard {
      setupCardAbilities(ability) {
        this.response({
          title: 'Ready Aragorn after quest',
          limit: ability.limit.oncePerPhase(),
          condition: this.game.phase === phases.quest && this.isCommittedToQuest,
          cost: ability.costs.payResource(1, { resourcePool: this.resources }),
          target: '',
          handler: context => {
            const currentCard = context.event.card;
            currentCard.controller.readyCard(currentCard);
            this.game.addMessage(`${this.controller} spends 1 resource to ready ${this.name} in response to committing him to a quest`);
          },
        });
      };
    }
  });
});
