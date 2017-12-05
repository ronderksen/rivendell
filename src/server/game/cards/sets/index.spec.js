import uuid from 'uuid';
import PlayerCards from './index';

jest.mock('uuid');
uuid.v1 = jest.fn().mockReturnValue('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx')

describe('PlayerCards', () => {
  it('should load the player cards', () => {
    expect(PlayerCards['116-001'].name).toBe('Aragorn');
  });

  it('should be possible to instantiate card with given card data', () => {
    const cardData = {
      "name": "Aragorn",
      "label": "Aragorn",
      "id": "33",
      "unique": "Yes",
      "type": "Hero",
      "deck": "Hero",
      "sphere": "Leadership",
      "encounter": "None",
      "cost": 0,
      "textcost": "",
      "th": "12",
      "wt": "2",
      "atk": "3",
      "def": "2",
      "hp": "5",
      "trait": "Dunedain. Noble. Ranger.",
      "text": "Sentinel.<br />Response: After Aragorn commits to a quest, spend 1 resource from his resource pool to ready him.",
      "shadow": "",
      "flavor": null,
      "set": "Core",
      "setid": "116",
      "setname": "Core Set",
      "num": "001",
      "illustrator": "John Stanko",
      "img": "aragorn-core.jpg",
      "imgfolder": "lotr",
      "imgsize": "high",
      "sequence": "",
      "fullurl": "http://www.cardgamedb.com/index.php/lotr/lord-of-the-rings-card-spoiler/_/core/aragorn-core",
      "guid": "",
      "packquantity": "1",
      "furl": "aragorn-core",
      "rating": "4",
      "max": 1,
      "difficulty": "0",
      "victory": "",
      "banned": null,
      "encounterlist": "",
      "rabbr": ""
    };
    const aragornCard = new PlayerCards['116-001']({name: 'chevalric'}, cardData);
    expect(aragornCard).toMatchSnapshot();
  })
});
