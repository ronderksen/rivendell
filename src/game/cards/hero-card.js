import { cardTypes, spheres } from '../constants';
import BaseCard from './base-card';

class HeroCard extends BaseCard {
  constructor(owner, cardData) {
    super(owner, cardData);

    this.type = cardTypes.hero;
    this.isUnique = cardData.isUnique;
    this.startingThreat = cardData.startingThreat;
    this.willPower = cardData.willPower;
    this.attack = cardData.attack;
    this.defense = cardData.defense;
    this.hitPoints = cardData.hitPoints;
    this.spheres = [];
    this.resources = 0;
    this.addResourceIcon(cardData.sphere);

    this.isCommittedToQuest = false;
    this.isAttacking = false;
    this.isDefending = false;
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

  addResourceIcon(sphere) {
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
