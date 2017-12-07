import { cardTypes, spheres } from '../constants';
import BaseCard from './base-card';

class CharacterCard extends BaseCard {
  constructor(owner, cardData) {
    super(owner, cardData);

    this.isUnique = cardData.unique === 'Yes';
    this.startingThreat = parseInt(cardData.th, 10);
    this.willPower = parseInt(cardData.wt, 10);
    this.attack = parseInt(cardData.atk, 10);
    this.defense = parseInt(cardData.def, 10);
    this.hitPoints = parseInt(cardData.hp, 10);
    this.wounds = 0;

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
