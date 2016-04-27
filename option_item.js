'use strict';

const Serializable = require('./serializable');

const Fields = require('./fields');

class OptionItem extends Serializable {
  // for NamedObjectMap
  get name() {
    return this.label;
  }
}

OptionItem.property('label', '');
OptionItem.property('insertionFields', [], [Fields]);
OptionItem.property('deadline', '', true);

module.exports = OptionItem;
