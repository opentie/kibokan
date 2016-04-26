const Serializable = require('./serializable');

const Fields = require('./fields');

class OptionItem extends Serializable {
}
OptionItem.property('label', '');
OptionItem.property('insertionFields', [], [Fields]);
OptionItem.property('deadline', '', true);

module.exports = OptionItem;
