import EventCard from '../../event-card';
import {locations, spheres} from "../../../constants";

export default class DwarvenTomb extends EventCard {
  static code = '116-020';

  setupCardAbilities() {
    this.action({
      target: {
        cardCondition(card) {
          return ( 
            card.hasSphere(spheres.spirit) &&
            card.controller === this.controller &&  
            card.location === locations.playerDiscardPile
          );
        }
      },
      handler: context => {
        this.controller.moveCard(context.target, locations.hand);
      }
    })
  }
}
