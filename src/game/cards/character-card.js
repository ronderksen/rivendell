import { cardTypes, spheres } from '../constants';
import BaseCard from './base-card';

class CharacterCard extends BaseCard {
  constructor(owner, cardData) {
    super(owner, cardData);

    this.type = cardTypes.hero;
    this.isUnique = cardData.isUnique;
    this.startingThreat = cardData.startingThreat;
    this.willPower = cardData.willPower;
    this.attack = cardData.attack;
    this.defense = cardData.defense;
    this.hitPoints = cardData.hitPoints;
    this.damage = 0;
    this.spheres = [spheres[cardData.sphere.toLowerCase()]];

    this.isCommittedToQuest = false;
    this.isAttacking = false;
    this.isDefending = false;
  }
}

export default CharacterCard;
