import AllyCard from '../../ally-card';
import {afterCardPlayed} from '../../../events';
import {cardTypes, locations} from "../../../constants";

// TODO: improve implementation
export default class EreborHammersmith extends AllyCard {
  static code = '116-059';

  setCardAbilities() {
    const { attachment } = cardTypes;
    this.response({
      when: {
        [afterCardPlayed]: event => event.target === this,
      },
      choosePlayer: player => player.discardPile.find(card => card.getType() === attachment) !== undefined,
      handler: context => {
        const firstAttachmentInDiscard = context.player.discardPile.find(card => card.getType() === attachment);
        if (firstAttachmentInDiscard !== undefined) {
          context.player.moveCard(firstAttachmentInDiscard, locations.hand);
          this.game
            .addMessage(`${this.owner.name} uses ${this.name} to move ${firstAttachmentInDiscard.name} 
            from ${context.player.name}'s discard pile to their hand`);
        } else {
          this.game.addMessage(`${this.owner.name} uses ${this.name}, but there were no attachments`)
        }
      }
    });
  }
}
