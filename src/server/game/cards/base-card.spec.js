import uuid from 'uuid';
import BaseCard from './base-card';

describe('BaseCard class', () => {
  const baseCard = new BaseCard(uuid.v1(), {
    setid: '01',
    num: '001',
    name: 'Some card with keywords',
  });

  it('should parse keywords', () => {
    baseCard.parseKeywords('Doomed 1. Surge.');
    expect(baseCard.keywords.simple).toEqual({
      surge: true,
    });
    expect(baseCard.keywords.valued).toEqual({
      doomed: 1
    });
  });

  it('should allow for persistent effects', () => {
    baseCard.persistentEffect({
      title: 'a persistent effect',
    });
    expect(baseCard.abilities.persistentEffects.length).toBe(1);
  });
});
