import ExhaustCost from './costs/exhaust-cost';
import SelfCost from './costs/self-cost';
import CostBuilders from './costs/cost-builders';
// import ParentCost from './costs/parent-cost';

const Costs = {
  exhaustSelf() {
    const action = new ExhaustCost();
    return new SelfCost(action);
  },

  exhaustParent() {
    const action = new ExhaustCost();
    // return new ParentCost(action);
  },

  payResource: (amount, options)  => CostBuilders.discardResources(amount, options).self(),
};

export default Costs;
