export default {
  modifyAttack(value) {
    return {
      apply(card) {
        card.modifyAttack(value);
      },
      unapply(card) {
        card.modifyAttack(-value);
      }
    }
  },

  modifyDefense(value) {
    return {
      apply(card) {
        card.modifyDefense(value);
      },
      unapply(card) {
        card.modifyDefense(-value);
      }
    }
  },

  modifyHitpoints(value) {
    return {
      apply(card) {
        card.modifyHitpoints(value);
      },
      unapply(card) {
        card.modifyHitpoints(-value);
      }
    }
  },

  modifyWillpower(value) {
    return {
      apply(card) {
        card.modifyWillpower(value);
      },
      unapply(card) {
        card.modifyWillpower(-value);
      }
    }
  },

  modifyThreatStrength(value) {
    return {
      apply(card) {
        card.modifyThreatStrength(value);
      },
      unapply(card) {
        card.modifyThreatStrength(-value);
      }
    }
  },



  modifyProgress(value) {
    return {
      apply(card) {
        card.modifyProgress(value);
      },
      unapply(card) {
        card.modifyProgress(-value);
      }
    };
  },

  modifyResources(value) {
    return {
      apply(card) {
        card.modifyResources(value);
      },
      unapply(card) {
        card.modifyResources(-value);
      }
    }
  },

  modifyParentResources(value) {
    return {
      apply(card) {
        card.parent.modifyResources(value);
      },
      unapply(card) {
        card.parent.modifyResources(-value);
      }
    }
  },

  canNotAttack() {
    return {
      apply(card) {
        card.addAttackRestriction('any');
      },
      unapply(card) {
        card.removeAttackRestriction('any');
      }
    }
  },

  modifyWounds(amount) {
    return {
      apply(card) {
        card.modifyWounds(amount);
      },
      unapply(card) {
        card.modifyWounds(-amount);
      }
    }
  },
  
  addTrait(trait) {
    return {
      apply(card) {
        card.addTrait(trait);
      },
      unapply(card) {
        card.removeTrait(trait);
      }
    }
  }
}
