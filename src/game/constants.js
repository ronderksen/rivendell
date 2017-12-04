import nskeymirror from 'nskeymirror';

export const phases = nskeymirror({
  resource: null,
  planning: null,
  quest: null,
  travel: null,
  encounter: null,
  combat: null,
  refresh: null,
}, 'phases');

export const durations = nskeymirror({
  persistent: null,
}, 'durations');

export const cardTypes = nskeymirror({
  // player card types
  hero: null,
  ally: null,
  attachment: null,
  event: null,
  objective: null,
  // encounter set card types
  enemy: null,
  location: null,
  treachery: null,
  quest: null,
}, 'cardTypes');

export const spheres = nskeymirror({
  'leadership': null,
  'lore': null,
  'spirit': null,
  'tactics': null,
  'fellowship': null,
  'baggins': null,
  'neutral': null,
}, 'spheres');

export const locations = nskeymirror({
  'encounterDeck': null,
  'encounterDiscard': null,
  'engagementArea': null,
  'playArea': null,
  'playerDiscardPile': null,
  'playerDrawDeck': null,
  'stagingArea': null,
  'questDeck': null,
  'activeLocationArea': null,
  'hand': null,
}, 'locations');

export const traits = nskeymirror({
  'dwarf': null,
  'orc': null,
});
