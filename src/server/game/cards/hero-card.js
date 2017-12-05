import {cardTypes, spheres} from '../constants';
import CharacterCard from './character-card';

class HeroCard extends CharacterCard {
  constructor(owner, cardData) {
    super(owner, cardData);

    this.type = cardTypes.hero;
  }
  addResources(amount = 1) {
      this.resources += amount;
  }

  payResources(amount = 1, sphere = this.spheres[0]) {
    if (this.spheres.indexOf(sphere) === -1) {
      const sphereName = Object.keys(spheres).find(key => spheres[key] === sphere);
      this.game.addMessage(`${this.name} can't pay ${sphereName} resources`);
      return;
    }
    this.resources -= amount;
  }

  addSphere(sphere) {
    const validSpheres = Object.values(spheres);
    if (validSpheres.indexOf(sphere) === -1) {
      if (this.spheres.length === 0) {
        this.game.addMessage(`${this.name} does not have a valid sphere (${sphere})`);
      } else {
        this.game.addMessage(`Unable to add sphere '${sphere}' to ${this.name}`);
      }
      return;
    }
    this.spheres.push(sphere);
  }
}

export default HeroCard;
