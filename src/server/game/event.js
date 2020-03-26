class Event {
  constructor(name, params, merge = false) {
    this.name = name;
    this.cancelled = false;
    this.replacementHandler = null;

    if(merge) {
      Object.assign(this, params);
      this.params = [this].concat([params]);
    } else {
      this.params = [this].concat(params);
    }
  }

  cancel() {
    this.cancelled = true;
  }

  replaceHandler(handler) {
    this.replacementHandler = handler;
  }

  executeHandler(handler) {
    if(this.replacementHandler) {
      this.replacementHandler(...this.params);
    } else {
      handler(...this.params);
    }
  }

  saveCard(card) {
    if(!this.cards) {
      return;
    }

    this.removeCard(card);
    card.markAsSaved();
    card.game.raiseEvent('onCardSaved', { card });
  }

  removeCard(card) {
    if(!this.cards) {
      return;
    }

    this.cards = this.cards.filter(c => c !== card);

    if(this.cards.length === 0) {
      this.cancel();
    }
  }
}

module.exports = Event;
