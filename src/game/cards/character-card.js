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
    this.wounds = 0;
    this.spheres = [spheres[cardData.sphere.toLowerCase()]];

    this.isCommittedToQuest = false;
    this.isAttacking = false;
    this.isDefending = false;
  }

  modifyAttack(value) {
    this.attack += value;
  }

  modifyDefense(value) {
    this.defense += value;
  }

  modifyHitpoints(value) {
    this.hitpoints += value;
  }

  modifyWillpower(value) {
    this.willPower += value;
  }

  modifyWounds(value) {
    this.wounds += value;
    if (this.wounds >= this.hitpoints) {
      // TODO: kill character
    }
  }

  heal(value) {
    this.wounds -= value;
    if (this.wounds < 0) {
      this.wounds = 0;
    }
  }

  isCharacter() {
    return true;
  }
}

export default CharacterCard;
