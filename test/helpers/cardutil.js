const CardUtil = {
  matchCardByNameAndPack(labelOrName) {
    var name = labelOrName;
    var pack;
    var match = labelOrName.match(/^(.*)\s\((.*)\)$/);
    if(match) {
      name = match[1];
      pack = match[2];
    }

    return function(cardData) {
      return cardData.name === name && (!pack || cardData.pack_code === pack);
    };
  }
};

module.exports = CardUtil;


export default {
  matchCardByNameAndPack(labelOrName) {
    const match = labelOrName.match(/^(.*)\s\((.*)\)$/);
    let name = labelOrName;
    let pack;

    if (match) {
      [, name, pack] = match;
    }
    return (cardData) => cardData.name.toLowerCase() === name.toLowerCase() && (!pack || cardData.setid === pack);
  }
};
