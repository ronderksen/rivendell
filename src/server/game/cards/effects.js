export default class Effects {
  modifyAttack(value) {
    return {
      apply(card) {
        card.modifyAttack(value, true);
      },
      unapply(card) {
        card.modifyAttack(-value, false);
      }
    }
  }
  modifyDefense(value) {
    return {
      apply(card) {
        card.modifyDefense(value, true);
      },
      unapply(card) {
        card.modifyDefense(-value, false);
      }
    }
  }
  modifyProgress(value) {
    return {
      apply(card) {
        card.modifyProgress(value);
      },
      unapply(card) {
        card.modifyProgress(-value);
      }
    };
  }

  modifyResources(value) {
    return {
      apply(card) {
        card.modifyResources(value);
      },
      unapply(card) {
        card.modifyResources(-value);
      }
    }
  }

  modifyParentResources(value) {
    return {
      apply(card) {
        card.parent.modifyResources(value);
      },
      unapply(card) {
        card.parent.modifyResources(-value);
      }
    }
  }

  canNotAttack() {
    return {
      apply(card) {
        card.addAttackRestriction('any');
      },
      unapply(card) {
        card.removeAttackRestriction('any');
      }
    }
  }
}
