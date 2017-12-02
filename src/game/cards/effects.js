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
}
