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
}
