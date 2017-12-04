import BaseCard from './base-card';

export default class AttachmentCard extends BaseCard {
  whileAttached(properties) {
    this.persistentEffect({
      condition: properties.condition,
      match: (card, context) => card === this.parent && (!properties.match || properties.match(card, context)),
      targetController: 'any',
      effect: properties.effect,
      recalculateWhen: properties.recalculateWhen
    });
  }
}
